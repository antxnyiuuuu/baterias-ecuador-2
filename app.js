import { db } from './database.js';

// ============================================
// STATE MANAGEMENT
// ============================================

let currentStep = 1;
let selectedBrand = null;
let selectedModel = null;

// ============================================
// DOM ELEMENTS
// ============================================

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
// STEP NAVIGATION
// ============================================

function showStep(stepNumber) {
    // Remove active class from all steps
    step1.classList.remove('active');
    step2.classList.remove('active');
    step3.classList.remove('active');

    // Add active class to target step
    setTimeout(() => {
        if (stepNumber === 1) {
            step1.classList.add('active');
        } else if (stepNumber === 2) {
            step2.classList.add('active');
        } else if (stepNumber === 3) {
            step3.classList.add('active');
        }
    }, 100);

    currentStep = stepNumber;
}

// ============================================
// STEP 1: BRAND SELECTION
// ============================================

function renderBrands() {
    brandGrid.innerHTML = '';

    db.forEach(marca => {
        const brandCard = document.createElement('div');
        brandCard.className = 'brand-card';
        brandCard.innerHTML = `
            <div class="brand-name">${marca.nombre_marca}</div>
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

    // Update step header
    modelStepTitle.textContent = `Seleccione el Modelo`;
    modelStepSubtitle.textContent = marca.nombre_marca;

    marca.modelos.forEach(modelo => {
        const modelCard = document.createElement('div');
        modelCard.className = 'model-card';
        modelCard.innerHTML = `
            <div class="model-image-container">
                <img src="${modelo.img}" alt="${modelo.nombre}" class="model-image">
            </div>
            <div class="model-info">
                <div class="model-name">${modelo.nombre}</div>
                <div class="model-year">${modelo.anios[0]}</div>
            </div>
        `;

        modelCard.addEventListener('click', () => {
            selectedModel = modelo;
            renderResult(marca, modelo);
            showStep(3);
        });

        modelGrid.appendChild(modelCard);
    });
}

// ============================================
// STEP 3: RESULT DISPLAY
// ============================================

function renderResult(marca, modelo) {
    resultCard.innerHTML = `
        <div class="result-image-section">
            <img src="${modelo.img}" alt="${marca.nombre_marca} ${modelo.nombre}" class="result-image">
        </div>
        
        <div class="result-info-section">
            <div class="result-brand">${marca.nombre_marca}</div>
            <h2 class="result-model">${modelo.nombre}</h2>
            <div class="result-year">${modelo.anios[0]}</div>
            
            <div class="battery-divider"></div>
            
            <div class="battery-info">
                <div class="battery-label">
                    <i class="fas fa-car-battery"></i>
                    <span>Batería Recomendada</span>
                </div>
                <div class="battery-code">${modelo.bateria.codigo}</div>
                <div class="battery-specs">${modelo.bateria.specs}</div>
            </div>
        </div>
    `;
}

// ============================================
// EVENT LISTENERS
// ============================================

backToStep1.addEventListener('click', () => {
    showStep(1);
    selectedBrand = null;
});

backToStep2.addEventListener('click', () => {
    showStep(2);
    selectedModel = null;
});

newSearchButton.addEventListener('click', () => {
    selectedBrand = null;
    selectedModel = null;
    showStep(1);
});

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    renderBrands();
    showStep(1);
});
