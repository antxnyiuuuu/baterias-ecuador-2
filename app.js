// ============================================
// GLOBAL STATE
// ============================================

let vehicleData = [];
let batteryData = [];
let batterySpecs = []; // Global battery specs
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
const brandSelect = document.getElementById('brandSelect');
const modelGrid = document.getElementById('modelGrid');
const modelSelect = document.getElementById('modelSelect');
const resultCard = document.getElementById('resultCard');

const modelStepTitle = document.getElementById('modelStepTitle');
const modelStepSubtitle = document.getElementById('modelStepSubtitle');

const startQuoteButton = document.getElementById('startQuoteButton');
const backToStep0 = document.getElementById('backToStep0');
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

        // Import battery specs
        const { batterySpecs: importedSpecs } = await import('./battery_specs.js');
        batterySpecs = importedSpecs;


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

    // Scroll to top when changing steps
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

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
    if (brandSelect) {
        brandSelect.innerHTML = '<option value="">Buscar marca rápidamente...</option>';
    }
    const brands = extractBrands();

    if (brands.length === 0) {
        brandGrid.innerHTML = '<p style="color: var(--grey-pearl);">No se encontraron marcas en el catálogo.</p>';
        return;
    }

    brands.forEach(marca => {
        // Get brand logo from database
        const brandData = db.find(b => b.nombre_marca === marca);
        const logoPath = brandData?.logo || '';

        // Add to dropdown
        if (brandSelect) {
            const option = document.createElement('option');
            option.value = marca;
            option.textContent = marca;
            brandSelect.appendChild(option);
        }

        // Add to grid
        const brandCard = document.createElement('div');
        brandCard.className = 'brand-card';
        brandCard.innerHTML = `
            ${logoPath ? `<img src="${logoPath}" alt="${marca}" class="brand-logo" onerror="this.style.display='none'">` : ''}
            <div class="brand-name">${marca}</div>
        `;

        brandCard.addEventListener('click', () => {
            selectedBrand = marca;
            renderModels(marca);
            showStep(2);
        });

        brandGrid.appendChild(brandCard);
    });

    // Add event listener for dropdown
    if (brandSelect) {
        brandSelect.addEventListener('change', (e) => {
            const selectedMarca = e.target.value;
            if (selectedMarca) {
                selectedBrand = selectedMarca;
                renderModels(selectedMarca);
                showStep(2);
                // Reset selector after a short delay to allow navigation
                setTimeout(() => {
                    if (brandSelect) {
                        brandSelect.value = '';
                    }
                }, 100);
            }
        });
    }
}

// ============================================
// STEP 2: MODEL SELECTION
// ============================================

let availableModels = []; // Store available models for search

function renderModels(marca) {
    modelGrid.innerHTML = '';
    if (modelSelect) {
        modelSelect.innerHTML = '<option value="">Seleccionar modelo rápidamente...</option>';
    }

    // Get models directly from database for this brand
    const brandData = db.find(b => b.nombre_marca === marca);

    if (!brandData || !brandData.modelos || brandData.modelos.length === 0) {
        modelGrid.innerHTML = '<p style="color: var(--grey-pearl);">No se encontraron modelos para esta marca.</p>';
        return;
    }

    modelStepTitle.textContent = 'Seleccione el Modelo';
    modelStepSubtitle.textContent = marca;

    // Store available models for search
    availableModels = brandData.modelos;

    // Setup search input
    setupModelSearch(marca);

    // Use models directly from database
    brandData.modelos.forEach(modelData => {
        // Add to dropdown
        if (modelSelect) {
            const option = document.createElement('option');
            option.value = modelData.nombre;
            option.textContent = modelData.nombre;
            modelSelect.appendChild(option);
        }
        const modelImage = modelData.img || '';

        const modelCard = document.createElement('div');
        modelCard.className = 'model-card';

        const imageContainer = document.createElement('div');
        imageContainer.className = 'model-image-container';

        if (modelImage) {
            const img = document.createElement('img');
            img.src = modelImage;
            img.alt = `${marca} ${modelData.nombre}`;
            img.className = 'model-image';
            img.loading = 'lazy';
            img.onerror = function () {
                const fallback = document.createElement('div');
                fallback.className = 'image-fallback';
                fallback.innerHTML = '<i class="fas fa-car"></i>';
                if (this.parentNode) {
                    this.parentNode.replaceChild(fallback, this);
                }
            };
            imageContainer.appendChild(img);
        } else {
            const fallback = document.createElement('div');
            fallback.className = 'image-fallback';
            fallback.innerHTML = '<i class="fas fa-car"></i>';
            imageContainer.appendChild(fallback);
        }

        modelCard.appendChild(imageContainer);

        const modelInfo = document.createElement('div');
        modelInfo.className = 'model-info';
        modelInfo.innerHTML = `<div class="model-name">${modelData.nombre}</div>`;
        modelCard.appendChild(modelInfo);

        modelCard.addEventListener('click', () => {
            selectedModel = {
                marca: marca,
                modelo: modelData.nombre,
                img: modelImage,
                bateria: modelData.bateria
            };
            showYearModal(selectedModel);
        });

        modelGrid.appendChild(modelCard);
    });

    // Add event listener for model dropdown
    if (modelSelect) {
        modelSelect.addEventListener('change', (e) => {
            const selectedModelName = e.target.value;
            if (selectedModelName) {
                const modelData = brandData.modelos.find(m => m.nombre === selectedModelName);
                if (modelData) {
                    selectedModel = {
                        marca: marca,
                        modelo: modelData.nombre,
                        img: modelData.img || '',
                        bateria: modelData.bateria
                    };
                    showYearModal(selectedModel);
                    // Reset selector after a short delay
                    setTimeout(() => {
                        if (modelSelect) {
                            modelSelect.value = '';
                        }
                    }, 100);
                }
            }
        });
    }
}

// ============================================
// MODEL SEARCH WITH AUTOCOMPLETE
// ============================================

function setupModelSearch(marca) {
    const searchInput = document.getElementById('modelSearchInput');
    const searchResults = document.getElementById('modelSearchResults');

    if (!searchInput) return;

    // Clear previous search
    searchInput.value = '';
    searchResults.innerHTML = '';
    searchResults.classList.remove('active');

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (query.length === 0) {
            searchResults.innerHTML = '';
            searchResults.classList.remove('active');
            // Show all models
            const allCards = modelGrid.querySelectorAll('.model-card');
            allCards.forEach(card => card.style.display = '');
            return;
        }

        // Filter models
        const filtered = availableModels.filter(model =>
            model.nombre.toLowerCase().includes(query)
        );

        // Update grid visibility
        const allCards = modelGrid.querySelectorAll('.model-card');
        allCards.forEach(card => {
            const modelName = card.querySelector('.model-name').textContent.toLowerCase();
            if (modelName.includes(query)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });

        // Show autocomplete suggestions
        if (filtered.length > 0 && query.length > 0) {
            searchResults.innerHTML = '';
            filtered.slice(0, 5).forEach(model => {
                const suggestion = document.createElement('div');
                suggestion.className = 'model-search-suggestion';
                suggestion.textContent = model.nombre;
                suggestion.addEventListener('click', () => {
                    searchInput.value = model.nombre;
                    searchResults.innerHTML = '';
                    searchResults.classList.remove('active');
                    // Trigger search to filter grid
                    searchInput.dispatchEvent(new Event('input'));
                });
                searchResults.appendChild(suggestion);
            });
            searchResults.classList.add('active');
        } else if (query.length > 0) {
            searchResults.innerHTML = '<div class="model-search-no-results">No se encontraron modelos</div>';
            searchResults.classList.add('active');
        } else {
            searchResults.innerHTML = '';
            searchResults.classList.remove('active');
        }
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });

    // Handle keyboard navigation
    searchInput.addEventListener('keydown', (e) => {
        const suggestions = searchResults.querySelectorAll('.model-search-suggestion');
        if (suggestions.length === 0) return;

        const active = searchResults.querySelector('.model-search-suggestion.active');

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (active) {
                active.classList.remove('active');
                const next = active.nextElementSibling || suggestions[0];
                next.classList.add('active');
            } else {
                suggestions[0].classList.add('active');
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (active) {
                active.classList.remove('active');
                const prev = active.previousElementSibling || suggestions[suggestions.length - 1];
                prev.classList.add('active');
            } else {
                suggestions[suggestions.length - 1].classList.add('active');
            }
        } else if (e.key === 'Enter' && active) {
            e.preventDefault();
            active.click();
        }
    });
}

// ============================================
// YEAR SELECTION MODAL
// ============================================

function showYearModal(model) {
    yearModalVehicleInfo.textContent = `${model.marca} ${model.modelo}`;
    yearGrid.innerHTML = '';

    // Get model data from database for battery info
    const brandData = db.find(b => b.nombre_marca === model.marca);
    const modelData = brandData?.modelos.find(m => m.nombre === model.modelo);

    // Generate years from 2000 to current year
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 2000; year <= currentYear; year++) {
        years.push(String(year));
    }

    // Reverse to show most recent years first
    years.reverse();

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
    let batteryCode = vehicle.bateria?.codigo;

    // Fallback logic to find battery code if not directly on vehicle
    if (!batteryCode) {
        const brandData = db.find(b => b.nombre_marca === vehicle.marca);
        const modelData = brandData?.modelos.find(m => m.nombre === vehicle.modelo);
        if (modelData) {
            batteryCode = modelData.bateria?.codigo;
        }
    }

    // Find detailed specs
    const detailedSpecs = batterySpecs.find(s => s.caja === batteryCode) || {
        // Mock Data / Fallback
        caja: batteryCode || "N/A",
        modelo: "Genérico",
        precio_con_iva: 0,
        precio_sin_iva: 0,
        capacidad_ah: 0,
        cca_18c: 0,
        dimensiones_mm: { largo: 0, ancho: 0, alto: 0 },
        polaridad: "N/A",
        reserva_min: 0,
        ca_0c: 0,
        ca_27c: 0,
        garantia_meses: 0,
        img: "https://via.placeholder.com/400x300?text=Bateria+Generica"
    };

    resultCard.innerHTML = `
        <div class="result-battery-section">
            <div class="battery-header">
                <i class="fas fa-car-battery"></i>
                <h3>Batería Recomendada</h3>
            </div>
            
            <div class="battery-content-wrapper">
                <!-- COLUMNA IZQUIERDA: IMAGEN -->
                <div class="battery-visual">
                    <img src="${detailedSpecs.img || 'https://bateriasecuador.com/wp-content/uploads/2023/09/42-01-700x700.webp'}" 
                         alt="Batería ${detailedSpecs.modelo}" 
                         class="battery-image-large"
                         onerror="this.src='https://bateriasecuador.com/wp-content/uploads/2023/09/42-01-700x700.webp'">
                    <div class="battery-code-badge">${detailedSpecs.caja}</div>
                </div>

                <!-- COLUMNA DERECHA: INFO -->
                <div class="battery-info-panel">
                    <!-- Precio y Modelo -->
                    <div class="price-header">
                        <div class="battery-model-name">Modelo ${detailedSpecs.modelo}</div>
                        <div class="battery-price">$${detailedSpecs.precio_con_iva.toFixed(2)} <span class="tax-text">inc. IVA</span></div>
                    </div>
                    
                    <!-- Grid de Especificaciones (Iconos) -->
                    <div class="specs-grid">
                        <div class="spec-box">
                            <i class="fas fa-bolt"></i>
                            <span class="spec-value">${detailedSpecs.capacidad_ah} Ah</span>
                            <span class="spec-label">Capacidad</span>
                        </div>
                        <div class="spec-box">
                            <i class="fas fa-temperature-low"></i>
                            <span class="spec-value">${detailedSpecs.cca_18c}</span>
                            <span class="spec-label">CCA (-18°C)</span>
                        </div>
                        <div class="spec-box">
                            <i class="fas fa-shield-alt"></i>
                            <span class="spec-value">${detailedSpecs.garantia_meses} Meses</span>
                            <span class="spec-label">Garantía</span>
                        </div>
                    </div>
                    
                    <!-- Detalles Técnicos (Texto) -->
                    <div class="technical-details">
                        <div class="tech-row">
                            <span>Polaridad:</span>
                            <strong>${detailedSpecs.polaridad}</strong>
                        </div>
                        <div class="tech-row">
                            <span>Dimensiones:</span>
                            <strong>${detailedSpecs.dimensiones_mm.largo}x${detailedSpecs.dimensiones_mm.ancho}x${detailedSpecs.dimensiones_mm.alto} mm</strong>
                        </div>
                        <div class="tech-row">
                            <span>Reserva Min:</span>
                            <strong>${detailedSpecs.reserva_min} min</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

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
    if (brandSelect) {
        brandSelect.value = '';
    }
});

backToStep0.addEventListener('click', () => {
    showStep(0);
    selectedBrand = null;
    selectedModel = null;
    selectedYear = null;
    if (brandSelect) {
        brandSelect.value = '';
    }
});

backToStep1.addEventListener('click', () => {
    showStep(1);
    selectedBrand = null;
    selectedModel = null;
    if (brandSelect) {
        brandSelect.value = '';
    }
});

backToStep2.addEventListener('click', () => {
    showStep(2);
    selectedModel = null;
    selectedYear = null;
    if (modelSelect) {
        modelSelect.value = '';
    }
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

// ============================================
// CAROUSEL FUNCTIONALITY
// ============================================

let currentSlide = 0;
const carouselWrapper = document.getElementById('carouselWrapper');
const carouselSlides = carouselWrapper?.querySelectorAll('.carousel-slide');
const carouselDots = document.querySelectorAll('.carousel-dot');
const carouselPrev = document.getElementById('carouselPrev');
const carouselNext = document.getElementById('carouselNext');

function showSlide(index) {
    if (!carouselSlides || carouselSlides.length === 0) return;

    currentSlide = index;

    carouselSlides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentSlide);
    });

    carouselDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

function nextSlide() {
    if (!carouselSlides || carouselSlides.length === 0) return;
    currentSlide = (currentSlide + 1) % carouselSlides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    if (!carouselSlides || carouselSlides.length === 0) return;
    currentSlide = (currentSlide - 1 + carouselSlides.length) % carouselSlides.length;
    showSlide(currentSlide);
}

// Carousel event listeners
if (carouselNext) {
    carouselNext.addEventListener('click', nextSlide);
}

if (carouselPrev) {
    carouselPrev.addEventListener('click', prevSlide);
}

carouselDots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
});

// Auto-play carousel
let carouselInterval;
function startCarousel() {
    carouselInterval = setInterval(nextSlide, 4000); // Cambia cada 4 segundos
}

function stopCarousel() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
    }
}

// Pause on hover
const carouselContainer = document.querySelector('.carousel-container');
if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopCarousel);
    carouselContainer.addEventListener('mouseleave', startCarousel);
}

// Start loading data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    if (carouselSlides && carouselSlides.length > 0) {
        startCarousel();
    }
});
