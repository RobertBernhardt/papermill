// Modal Module
// Handles the paper form modal functionality

import { getSelectedPricingOptions, resetPricingOptions } from '../pricing/pricing.js';

// Price configurations
const paperTypePrices = {
    'seminar': 0,
    'bachelor': 10,
    'master': 15,
    'academic': 20,
    'phd': 30
};

const creativityLevelPrices = [0, 5, 10, 15, 25]; // index corresponds to level - 1

const qualityControlPrices = {
    'basic': 0,
    'advanced': 10,
    'hardcore': 25
};

// Mappings for synchronizing between pricing section and modal
const paperTypeMapping = {
    'Seminar Paper': 'seminar',
    'Bachelor Thesis': 'bachelor',
    'Master Thesis': 'master',
    'Academic Paper': 'academic',
    'PhD Thesis': 'phd'
};

const creativityLevelMapping = {
    'Basic': 1,
    'Advanced': 2,
    'Expert': 3,
    'Master': 4,
    'Insane': 5
};

const qualityControlMapping = {
    'Basic': 'basic',
    'Advanced': 'advanced',
    'Hardcore': 'hardcore'
};

/**
 * Initialize the modal functionality
 */
export function initModal() {
    const modal = document.getElementById('paperFormModal');
    const modalClose = modal.querySelector('.modal-close');
    const paperForm = modal.querySelector('.paper-form');
    
    // Add event listeners to pricing section CTA button
    const pricingCTA = document.querySelector('.pricing-cta .cta-button');
    if (pricingCTA) {
        pricingCTA.addEventListener('click', () => openModal(modal, paperForm));
    }
    
    // Add event listeners to all other CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button:not(.pricing-cta .cta-button)');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Reset to default options when opened from buttons outside pricing section
            resetPricingOptions();
            openModal(modal, paperForm);
        });
    });
    
    // Close modal when clicking the close button
    modalClose.addEventListener('click', () => closeModal(modal));
    
    // Close modal when clicking outside the modal content
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal(modal);
        }
    });
    
    // Close modal when pressing Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            closeModal(modal);
        }
    });
    
    // Set up form input listeners
    setupFormInputListeners(modal);
    
    // Handle form submission
    setupFormSubmission(paperForm, modal);
}

/**
 * Open the modal and initialize form values
 * @param {HTMLElement} modal - The modal element
 * @param {HTMLElement} paperForm - The paper form element
 */
function openModal(modal, paperForm) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
    
    // Reset form first
    paperForm.reset();
    
    // Apply selected options from pricing section
    applySelectedPricingOptions();
    
    // Update pricing in the modal
    updateModalPrices();
    
    // Focus on first input
    setTimeout(() => {
        const firstInput = modal.querySelector('input[type="text"]');
        if (firstInput) firstInput.focus();
    }, 400);
}

/**
 * Close the modal
 * @param {HTMLElement} modal - The modal element
 */
function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

/**
 * Apply selected pricing options from the pricing component to the modal form
 */
function applySelectedPricingOptions() {
    const options = getSelectedPricingOptions();
    
    // Set paper type
    const paperTypeValue = paperTypeMapping[options.paperScope];
    if (paperTypeValue) {
        const paperTypeRadio = document.querySelector(`input[name="paper-type"][value="${paperTypeValue}"]`);
        if (paperTypeRadio) paperTypeRadio.checked = true;
    }
    
    // Set creativity level
    const creativityLevel = creativityLevelMapping[options.creativityLevel];
    if (creativityLevel) {
        const creativitySlider = document.getElementById('creativity-level');
        creativitySlider.value = creativityLevel;
        
        // Update the slider labels UI
        updateCreativitySliderLabels(creativityLevel);
    }
    
    // Set quality control
    const qualityValue = qualityControlMapping[options.qualityControl];
    if (qualityValue) {
        const qualityRadio = document.querySelector(`input[name="quality-control"][value="${qualityValue}"]`);
        if (qualityRadio) qualityRadio.checked = true;
    }
}

/**
 * Set up event listeners for form inputs that affect pricing
 * @param {HTMLElement} modal - The modal element
 */
function setupFormInputListeners(modal) {
    // Update pricing when selections change
    document.querySelectorAll('input[name="paper-type"]').forEach(radio => {
        radio.addEventListener('change', updateModalPrices);
    });
    
    const creativitySlider = document.getElementById('creativity-level');
    creativitySlider.addEventListener('input', function() {
        updateCreativitySliderLabels(parseInt(this.value));
        updateModalPrices();
    });
    
    document.querySelectorAll('input[name="quality-control"]').forEach(radio => {
        radio.addEventListener('change', updateModalPrices);
    });
    
    // Set initial slider label highlight
    updateCreativitySliderLabels(1);
}

/**
 * Update the highlighted label for the creativity slider
 * @param {number} level - The creativity level (1-5)
 */
function updateCreativitySliderLabels(level) {
    const sliderLabels = document.querySelectorAll('.slider-labels span');
    sliderLabels.forEach((label, index) => {
        if (index === level - 1) {
            label.style.fontWeight = '700';
            label.style.color = 'var(--secondary)';
        } else {
            label.style.fontWeight = '400';
            label.style.color = 'var(--light-text)';
        }
    });
}

/**
 * Calculate and update the prices displayed in the modal
 */
function updateModalPrices() {
    // Price elements inside modal
    const paperTypePrice = document.getElementById('paper-type-price');
    const creativityPrice = document.getElementById('creativity-price');
    const qualityPrice = document.getElementById('quality-price');
    const modalTotalPrice = document.querySelector('.modal-price');
    
    // Get selected paper type
    const selectedPaperType = document.querySelector('input[name="paper-type"]:checked').value;
    const paperTypeValue = paperTypePrices[selectedPaperType];
    paperTypePrice.innerHTML = `<span>Paper type:</span><span>+$${paperTypeValue.toFixed(2)}</span>`;
    
    // Get creativity level
    const creativityLevel = parseInt(document.getElementById('creativity-level').value);
    const creativityValue = creativityLevelPrices[creativityLevel - 1];
    creativityPrice.innerHTML = `<span>Creativity level:</span><span>+$${creativityValue.toFixed(2)}</span>`;
    
    // Get quality control
    const selectedQuality = document.querySelector('input[name="quality-control"]:checked').value;
    const qualityValue = qualityControlPrices[selectedQuality];
    qualityPrice.innerHTML = `<span>Quality control:</span><span>+$${qualityValue.toFixed(2)}</span>`;
    
    // Calculate total
    const total = 5 + paperTypeValue + creativityValue + qualityValue;
    modalTotalPrice.textContent = `$${total.toFixed(2)}`;
    modalTotalPrice.classList.add('price-pulse');
    setTimeout(() => {
        modalTotalPrice.classList.remove('price-pulse');
    }, 500);
}

/**
 * Set up the form submission handling
 * @param {HTMLElement} paperForm - The paper form element
 * @param {HTMLElement} modal - The modal element
 */
function setupFormSubmission(paperForm, modal) {
    paperForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form values
        const paperTopic = document.getElementById('paper-topic').value;
        const academicDiscipline = document.getElementById('academic-discipline').value;
        const paperType = document.querySelector('input[name="paper-type"]:checked').value;
        const creativityLevel = document.getElementById('creativity-level').value;
        const qualityControl = document.querySelector('input[name="quality-control"]:checked').value;
        const email = document.getElementById('email').value;
        
        // Simulate form submission
        const submitButton = paperForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Processing...';
        submitButton.disabled = true;
        
        // Simulate API call with timeout
        setTimeout(() => {
            // Here you would normally send data to server
            console.log('Paper requested:', {
                topic: paperTopic,
                discipline: academicDiscipline,
                type: paperType,
                creativityLevel: creativityLevel,
                qualityControl: qualityControl,
                email: email
            });
            
            // Reset button
            submitButton.textContent = 'Success! Redirecting...';
            
            // Close modal after delay
            setTimeout(() => {
                closeModal(modal);
                // Reset button text after modal is closed
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 500);
            }, 1500);
        }, 2000);
    });
}