// ============================================
// GLOBAL STATE
// ============================================

let vehicleData = [];
let batteryData = [];
let currentStep = 1;
let selectedBrand = null;
let selectedVehicle = null;

// ============================================
// DOM ELEMENTS
// ============================================

const loadingScreen = document.getElementById('loadingScreen');
const errorScreen = document.getElementById('errorScreen');
const errorMessage = document.getElementById('errorMessage');
const retryButton = document.getElementById('retryButton');

const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');

const brandGrid = document.getElementById('brandGrid');
const modelGrid = document.getElementById('modelGrid');
const resultCard = document.getElementById('resultCard');

const modelStepTitle = document.getElementById('modelStepTitle');
const modelStepSubtitle = document.getElementById('modelStepSubtitle');

const backToStep1 = document.getElementById('backToStep1');
const backToStep2 = document.getElementById('backToStep2');
const newSearchButton = document.getElementById('newSearchButton');

// ============================================
// EXCEL LOADING & PARSING
// ============================================

async function loadExcelFile() {
    try {
        showLoading(true);

        const response = await fetch('./data/catalogo.xlsx');
        if (!response.ok) {
            throw new Error('No se pudo cargar el archivo catalogo.xlsx. Verifica que exista en ./data/');
        }

        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });

        // Read first sheet (vehicles)
        const vehicleSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawVehicleData = XLSX.utils.sheet_to_json(vehicleSheet);

        // DEBUG: Mostrar columnas encontradas
        if (rawVehicleData.length > 0) {
            console.log('🔍 DEBUG - Columnas en Excel:', Object.keys(rawVehicleData[0]));
            console.log('🔍 DEBUG - Primera fila:', rawVehicleData[0]);
        }

        // Read second sheet (batteries) - opcional
        let rawBatteryData = [];
        if (workbook.SheetNames.length > 1) {
            const batterySheet = workbook.Sheets[workbook.SheetNames[1]];
            rawBatteryData = XLSX.utils.sheet_to_json(batterySheet);
        }

        // Normalize data
        vehicleData = rawVehicleData.map(normalizeVehicleRow).filter(auto => {
            const bateria = auto.codigo_bateria;
            return bateria && bateria.toString().trim().length > 0 && bateria.toString().trim().toLowerCase() !== "n/a";
        });
        batteryData = rawBatteryData.map(normalizeBatteryRow);

        const totalLeidos = rawVehicleData.length;
        const disponibles = vehicleData.length;
        const descartados = totalLeidos - disponibles;

        if (vehicleData.length > 0) {
            console.log('🔍 DEBUG - Primer vehículo normalizado:', vehicleData[0]);
        } else {
            console.warn('⚠️ ADVERTENCIA: No hay vehículos después del filtro. Todas las filas fueron descartadas.');
        }

        console.log(`📊 Total autos leídos: ${totalLeidos}. Autos descartados por falta de batería: ${descartados}. Total disponibles: ${disponibles}.`);
        console.log('✅ Datos cargados:', { vehicleData, batteryData });

        showLoading(false);
        initializeApp();

    } catch (error) {
        console.error('❌ Error cargando Excel:', error);
        showError(error.message);
    }
}

// ============================================
// COLUMN NORMALIZATION
// ============================================

function normalizeVehicleRow(row) {
    const normalized = {};

    for (const [key, value] of Object.entries(row)) {
        const cleanKey = key.trim().toLowerCase(); // Limpiar espacios del nombre de columna

        // Detect MARCA (puede tener espacios)
        if (cleanKey.includes('marca')) {
            normalized.marca = String(value).trim();
        }
        // Detect MODELO
        else if (cleanKey.includes('modelo') || cleanKey.includes('model')) {
            normalized.modelo = String(value).trim();
        }
        // Detect AÑO/ANIO (con o sin tilde)
        else if (cleanKey.includes('año') || cleanKey.includes('anio') || cleanKey.includes('year')) {
            normalized.anios = String(value).trim();
        }
        // Detect TIPO
        else if (cleanKey.includes('tipo') || cleanKey.includes('type')) {
            normalized.tipo = String(value).trim();
        }
        // Detect MOTOR
        else if (cleanKey.includes('motor')) {
            normalized.motor = String(value).trim();
        }
        // Detect FE o MP (códigos de batería en tu Excel)
        else if (cleanKey === 'fe' || cleanKey === 'mp') {
            // Usar FE como código principal, MP como alternativo
            if (cleanKey === 'fe' && value && String(value).trim()) {
                normalized.codigo_bateria = String(value).trim();
            } else if (cleanKey === 'mp' && value && String(value).trim() && !normalized.codigo_bateria) {
                normalized.codigo_bateria = String(value).trim();
            }
        }
        // Detect CODIGO/HP (por si acaso)
        else if (cleanKey.includes('codigo') || cleanKey.includes('código') || cleanKey.includes('hp') || cleanKey.includes('ref')) {
            normalized.codigo_bateria = String(value).trim();
        }
    }

    return normalized;
}

function normalizeBatteryRow(row) {
    const normalized = {};

    for (const [key, value] of Object.entries(row)) {
        const lowerKey = key.toLowerCase().trim();

        // Detect CODIGO
        if (lowerKey.includes('codigo') || lowerKey.includes('código') || lowerKey.includes('ref')) {
            normalized.codigo = String(value).trim();
        }
        // Detect AMPERAJE
        else if (lowerKey.includes('amperaje') || lowerKey.includes('ah') || lowerKey.includes('ampere')) {
            normalized.amperaje = String(value).trim();
        }
        // Detect POLARIDAD
        else if (lowerKey.includes('polaridad') || lowerKey.includes('poste') || lowerKey.includes('terminal')) {
            normalized.polaridad = String(value).trim();
        }
        // Detect VOLTAJE
        else if (lowerKey.includes('voltaje') || lowerKey.includes('volt') || lowerKey.includes('v')) {
            normalized.voltaje = String(value).trim();
        }
        // Catch any other specs
        else {
            normalized[lowerKey] = String(value).trim();
        }
    }

    return normalized;
}

// ============================================
// DATA PROCESSING
// ============================================

function extractBrands() {
    const brands = [...new Set(vehicleData.map(v => v.marca))].filter(Boolean);
    return brands.sort();
}

function getModelsByBrand(brand) {
    return vehicleData.filter(v => v.marca === brand);
}

function getBatterySpecs(codigo) {
    return batteryData.find(b => b.codigo === codigo) || null;
}

// ============================================
// UI HELPERS
// ============================================

function showLoading(show) {
    if (show) {
        loadingScreen.classList.add('active');
    } else {
        loadingScreen.classList.remove('active');
    }
}

function showError(message) {
    errorMessage.textContent = message;
    loadingScreen.classList.remove('active');
    errorScreen.classList.add('active');
}

function hideError() {
    errorScreen.classList.remove('active');
}

function showStep(stepNumber) {
    step1.classList.remove('active');
    step2.classList.remove('active');
    step3.classList.remove('active');

    setTimeout(() => {
        if (stepNumber === 1) step1.classList.add('active');
        else if (stepNumber === 2) step2.classList.add('active');
        else if (stepNumber === 3) step3.classList.add('active');
    }, 100);

    currentStep = stepNumber;
}

// ============================================
// IMAGE HANDLING
// ============================================

function getVehicleImagePath(marca, modelo) {
    // Normalize: lowercase, replace spaces with underscores
    const normalizedMarca = marca.toLowerCase().replace(/\s+/g, '_');
    const normalizedModelo = modelo.toLowerCase().replace(/\s+/g, '_');
    return `./assets/img/autos/${normalizedMarca}_${normalizedModelo}.png`;
}

function createImageElement(marca, modelo, altText) {
    const imgPath = getVehicleImagePath(marca, modelo);
    const img = document.createElement('img');
    img.src = imgPath;
    img.alt = altText;
    img.className = 'model-image';

    // Fallback to icon if image fails
    img.onerror = function () {
        const fallback = document.createElement('div');
        fallback.className = 'image-fallback';
        fallback.innerHTML = '<i class="fas fa-car"></i>';
        this.parentNode.replaceChild(fallback, this);
    };

    return img;
}

// ============================================
// STEP 1: BRAND SELECTION
// ============================================

function renderBrands() {
    brandGrid.innerHTML = '';
    const brands = extractBrands();

    if (brands.length === 0) {
        brandGrid.innerHTML = '<p style="color: var(--grey-pearl);">No se encontraron marcas en el catálogo.</p>';
        return;
    }

    brands.forEach(marca => {
        const brandCard = document.createElement('div');
        brandCard.className = 'brand-card';
        brandCard.innerHTML = `
            <div class="brand-name">${marca}</div>
        `;

        brandCard.addEventListener('click', () => {
            selectedBrand = marca;
            renderModels(marca);
            showStep(2);
        });

        brandGrid.appendChild(brandCard);
    });
}

// ============================================
// STEP 2: MODEL SELECTION
// ============================================

function renderModels(marca) {
    modelGrid.innerHTML = '';
    const models = getModelsByBrand(marca);

    modelStepTitle.textContent = 'Seleccione el Modelo';
    modelStepSubtitle.textContent = marca;

    if (models.length === 0) {
        modelGrid.innerHTML = '<p style="color: var(--grey-pearl);">No se encontraron modelos para esta marca.</p>';
        return;
    }

    models.forEach(vehicle => {
        const modelCard = document.createElement('div');
        modelCard.className = 'model-card';

        const imageContainer = document.createElement('div');
        imageContainer.className = 'model-image-container';
        imageContainer.appendChild(createImageElement(vehicle.marca, vehicle.modelo, `${vehicle.marca} ${vehicle.modelo}`));

        modelCard.appendChild(imageContainer);
        modelCard.innerHTML += `
            <div class="model-info">
                <div class="model-name">${vehicle.modelo}</div>
                <div class="model-year">${vehicle.anios || 'N/A'}</div>
            </div>
        `;

        modelCard.addEventListener('click', () => {
            selectedVehicle = vehicle;
            renderResult(vehicle);
            showStep(3);
        });

        modelGrid.appendChild(modelCard);
    });
}

// ============================================
// STEP 3: RESULT DISPLAY
// ============================================

function renderResult(vehicle) {
    const batterySpecs = getBatterySpecs(vehicle.codigo_bateria);

    const specsText = batterySpecs
        ? `${batterySpecs.voltaje || '12V'} ${batterySpecs.amperaje || ''} - ${batterySpecs.polaridad || ''}`
        : 'Especificaciones no disponibles';

    resultCard.innerHTML = `
        <div class="result-image-section">
            ${createImageElement(vehicle.marca, vehicle.modelo, `${vehicle.marca} ${vehicle.modelo}`).outerHTML}
        </div>
        
        <div class="result-info-section">
            <div class="result-brand">${vehicle.marca}</div>
            <h2 class="result-model">${vehicle.modelo}</h2>
            <div class="result-year">${vehicle.anios || 'N/A'}</div>
            
            <div class="battery-divider"></div>
            
            <div class="battery-info">
                <div class="battery-label">
                    <i class="fas fa-car-battery"></i>
                    <span>Batería Recomendada</span>
                </div>
                <div class="battery-code">${vehicle.codigo_bateria || 'N/A'}</div>
                <div class="battery-specs">${specsText}</div>
            </div>
        </div>
    `;

    // Re-apply image error handling to result image
    const resultImage = resultCard.querySelector('.model-image');
    if (resultImage) {
        resultImage.className = 'result-image';
        resultImage.onerror = function () {
            const fallback = document.createElement('div');
            fallback.className = 'image-fallback';
            fallback.innerHTML = '<i class="fas fa-car"></i>';
            this.parentNode.replaceChild(fallback, this);
        };
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

retryButton.addEventListener('click', () => {
    hideError();
    loadExcelFile();
});

backToStep1.addEventListener('click', () => {
    showStep(1);
    selectedBrand = null;
});

backToStep2.addEventListener('click', () => {
    showStep(2);
    selectedVehicle = null;
});

newSearchButton.addEventListener('click', () => {
    selectedBrand = null;
    selectedVehicle = null;
    showStep(1);
});

// ============================================
// INITIALIZATION
// ============================================

function initializeApp() {
    renderBrands();
    showStep(1);
}

// Start loading Excel on page load
document.addEventListener('DOMContentLoaded', () => {
    loadExcelFile();
});
