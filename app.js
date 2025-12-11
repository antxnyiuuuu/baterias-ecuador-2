// ============================================
// GLOBAL STATE
// ============================================

let vehicleData = [];
let batteryData = [];
let db = []; // Global database reference
let currentStep = 0;
let selectedBrand = null;
let selectedModel = null;
let selectedYear = null;
let selectedVehicle = null;

// ============================================
// DOM ELEMENTS
// ============================================

const loadingScreen = document.getElementById('loadingScreen');
const errorScreen = document.getElementById('errorScreen');
const errorMessage = document.getElementById('errorMessage');
const retryButton = document.getElementById('retryButton');

const step0 = document.getElementById('step0');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');

const brandGrid = document.getElementById('brandGrid');
const modelGrid = document.getElementById('modelGrid');
const resultCard = document.getElementById('resultCard');

const modelStepTitle = document.getElementById('modelStepTitle');
const modelStepSubtitle = document.getElementById('modelStepSubtitle');

const startQuoteButton = document.getElementById('startQuoteButton');
const backToStep1 = document.getElementById('backToStep1');
const backToStep2 = document.getElementById('backToStep2');
const newSearchButton = document.getElementById('newSearchButton');

// Year Modal Elements
const yearModal = document.getElementById('yearModal');
const yearGrid = document.getElementById('yearGrid');
const yearModalVehicleInfo = document.getElementById('yearModalVehicleInfo');
const closeYearModal = document.getElementById('closeYearModal');

// ============================================
// DATA LOADING (Using database.js)
// ============================================

async function loadData() {
    try {
        showLoading(true);

        // Import database
        const { db: importedDb } = await import('./database.js');
        db = importedDb; // Store globally
        
        // Convert database format to vehicleData format
        vehicleData = [];
        db.forEach(brand => {
            brand.modelos.forEach(model => {
                const years = Array.isArray(model.anios) ? model.anios : [model.anios];
                years.forEach(year => {
                    vehicleData.push({
                        marca: brand.nombre_marca,
                        modelo: model.nombre,
                        anios: year,
                        codigo_bateria: model.bateria?.codigo || '',
                        img: model.img,
                        bateria: model.bateria
                    });
                });
            });
        });

        console.log('✅ Datos cargados desde database.js:', vehicleData.length, 'vehículos');
        showLoading(false);
        initializeApp();

    } catch (error) {
        console.error('❌ Error cargando datos:', error);
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
    step0.classList.remove('active');
    step1.classList.remove('active');
    step2.classList.remove('active');
    step3.classList.remove('active');

    setTimeout(() => {
        if (stepNumber === 0) step0.classList.add('active');
        else if (stepNumber === 1) step1.classList.add('active');
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
    
    // Get unique models for this brand
    const models = getModelsByBrand(marca);
    const uniqueModels = [...new Map(models.map(v => [v.modelo, v])).values()];

    modelStepTitle.textContent = 'Seleccione el Modelo';
    modelStepSubtitle.textContent = marca;

    if (uniqueModels.length === 0) {
        modelGrid.innerHTML = '<p style="color: var(--grey-pearl);">No se encontraron modelos para esta marca.</p>';
        return;
    }

    uniqueModels.forEach(model => {
        const modelCard = document.createElement('div');
        modelCard.className = 'model-card';

        const imageContainer = document.createElement('div');
        imageContainer.className = 'model-image-container';
        imageContainer.appendChild(createImageElement(model.marca, model.modelo, `${model.marca} ${model.modelo}`));

        modelCard.appendChild(imageContainer);
        modelCard.innerHTML += `
            <div class="model-info">
                <div class="model-name">${model.modelo}</div>
            </div>
        `;

        modelCard.addEventListener('click', () => {
            selectedModel = model;
            showYearModal(model);
        });

        modelGrid.appendChild(modelCard);
    });
}

// ============================================
// YEAR SELECTION MODAL
// ============================================

function showYearModal(model) {
    yearModalVehicleInfo.textContent = `${model.marca} ${model.modelo}`;
    yearGrid.innerHTML = '';
    
    // Get available years from database
    const brandData = db.find(b => b.nombre_marca === model.marca);
    const modelData = brandData?.modelos.find(m => m.nombre === model.modelo);
    const years = modelData && modelData.anios ? 
        (Array.isArray(modelData.anios) ? modelData.anios : [modelData.anios]) : 
        [];
    
    if (years.length === 0) {
        yearGrid.innerHTML = '<p style="color: var(--grey-pearl); text-align: center;">No hay años disponibles</p>';
    } else {
        years.forEach(year => {
            const yearCard = document.createElement('div');
            yearCard.className = 'year-card';
            yearCard.textContent = year;
            
            yearCard.addEventListener('click', () => {
                selectedYear = year;
                selectedVehicle = { 
                    marca: model.marca,
                    modelo: model.modelo,
                    anio: year,
                    img: modelData?.img,
                    bateria: modelData?.bateria
                };
                closeYearModalFunc();
                renderResult(selectedVehicle);
                showStep(3);
            });
            
            yearGrid.appendChild(yearCard);
        });
    }
    
    yearModal.classList.add('active');
}

function closeYearModalFunc() {
    yearModal.classList.remove('active');
}

// ============================================
// STEP 3: RESULT DISPLAY
// ============================================

function renderResult(vehicle) {
    // Get battery info from database or from vehicle object
    let battery = vehicle.bateria || {};
    let vehicleImg = vehicle.img;
    
    if (!battery.codigo) {
        const brandData = db.find(b => b.nombre_marca === vehicle.marca);
        const modelData = brandData?.modelos.find(m => m.nombre === vehicle.modelo);
        if (modelData) {
            battery = modelData.bateria || {};
            vehicleImg = modelData.img || vehicleImg;
        }
    }

    // Create vehicle image element
    let vehicleImageHTML = '';
    if (vehicleImg) {
        vehicleImageHTML = `<img src="${vehicleImg}" alt="${vehicle.marca} ${vehicle.modelo}" class="result-vehicle-img">`;
    } else {
        const imgElement = createImageElement(vehicle.marca, vehicle.modelo, `${vehicle.marca} ${vehicle.modelo}`);
        imgElement.className = 'result-vehicle-img';
        vehicleImageHTML = imgElement.outerHTML;
    }

    resultCard.innerHTML = `
        <div class="result-vehicle-section">
            <div class="result-vehicle-image">
                ${vehicleImageHTML}
            </div>
            <div class="result-vehicle-info">
                <div class="result-brand">${vehicle.marca}</div>
                <h2 class="result-model">${vehicle.modelo}</h2>
                <div class="result-year">Año: ${vehicle.anio || vehicle.anios || 'N/A'}</div>
            </div>
        </div>
        
        <div class="result-battery-section">
            <div class="battery-header">
                <i class="fas fa-car-battery"></i>
                <h3>Batería Recomendada</h3>
            </div>
            
            <div class="battery-image-container">
                <img src="${battery.img || 'https://via.placeholder.com/400x300?text=Bateria'}" 
                     alt="Batería ${battery.codigo || ''}" 
                     class="battery-image"
                     onerror="this.src='https://via.placeholder.com/400x300?text=Bateria'">
            </div>
            
            <div class="battery-details">
                <div class="battery-code-display">${battery.codigo || 'N/A'}</div>
                <div class="battery-specs-display">
                    <div class="spec-item">
                        <i class="fas fa-bolt"></i>
                        <span>${battery.specs || 'Especificaciones no disponibles'}</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Re-apply image error handling
    const resultImage = resultCard.querySelector('.result-vehicle-img');
    if (resultImage) {
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
    loadData();
});

startQuoteButton.addEventListener('click', () => {
    showStep(1);
});

backToStep1.addEventListener('click', () => {
    showStep(1);
    selectedBrand = null;
    selectedModel = null;
});

backToStep2.addEventListener('click', () => {
    showStep(2);
    selectedModel = null;
    selectedYear = null;
});

newSearchButton.addEventListener('click', () => {
    selectedBrand = null;
    selectedModel = null;
    selectedYear = null;
    selectedVehicle = null;
    showStep(0);
});

// Year Modal Events
if (closeYearModal) {
    closeYearModal.addEventListener('click', closeYearModalFunc);
}
if (yearModal) {
    const overlay = yearModal.querySelector('.year-modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeYearModalFunc);
    }
}

// ============================================
// INITIALIZATION
// ============================================

function initializeApp() {
    renderBrands();
    showStep(0);
}

// Start loading data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadData();
});
