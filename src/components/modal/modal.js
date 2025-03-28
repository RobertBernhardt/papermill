// Modal Module
// Handles the paper form modal functionality - simplified version that excludes form submission

import { getSelectedPricingOptions, resetPricingOptions } from '../pricing/pricing.js';
import { getPaperTopicSuggestion, getPaperFocusSuggestion, getAdditionalSuggestion } from '../suggestions/suggestions.js';

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
    if (!modal) {
        console.error('Paper form modal not found in the DOM');
        return;
    }
    
    const modalClose = modal.querySelector('.modal-close');
    
    if (!modalClose) {
        console.error('Required modal elements not found');
        return;
    }
    
    // Add event listeners to pricing section CTA button
    const pricingCTA = document.querySelector('.pricing-cta .cta-button');
    if (pricingCTA) {
        pricingCTA.addEventListener('click', () => openModal(modal));
    }
    
    // Add event listeners to all other CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button:not(.pricing-cta .cta-button)');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Reset to default options when opened from buttons outside pricing section
            resetPricingOptions();
            openModal(modal);
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
    
    // Set up expand buttons for additional fields
    setupExpandableFields();
    
    // NOTE: Form submission is now handled by the paperFormHandler module
}

/**
 * Open the modal and initialize form values
 * @param {HTMLElement} modal - The modal element
 */
function openModal(modal) {
    if (!modal) return;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
    
    // Apply selected options from pricing section
    applySelectedPricingOptions();
    
    // Update pricing in the modal
    updateModalPrices();
    
    // Set initial placeholder for main topic based on empty discipline
    updateTopicPlaceholder('');
    
    // Focus on first input
    setTimeout(() => {
        const firstInput = modal.querySelector('input[type="text"], textarea');
        if (firstInput) firstInput.focus();
    }, 400);
}

/**
 * Close the modal
 * @param {HTMLElement} modal - The modal element
 */
function closeModal(modal) {
    if (!modal) return;
    
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
        if (creativitySlider) {
            creativitySlider.value = creativityLevel;
            
            // Update the slider labels UI
            updateCreativitySliderLabels(creativityLevel);
        }
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
    if (!modal) return;
    
    // Update pricing when selections change
    document.querySelectorAll('input[name="paper-type"]').forEach(radio => {
        radio.addEventListener('change', updateModalPrices);
    });
    
    const creativitySlider = document.getElementById('creativity-level');
    if (creativitySlider) {
        creativitySlider.addEventListener('input', function() {
            updateCreativitySliderLabels(parseInt(this.value));
            updateModalPrices();
        });
        
        // Set initial slider label highlight
        updateCreativitySliderLabels(1);
    }
    
    document.querySelectorAll('input[name="quality-control"]').forEach(radio => {
        radio.addEventListener('change', updateModalPrices);
    });
    
    // Update topic placeholder when discipline changes
    const disciplineSelect = document.getElementById('academic-discipline');
    if (disciplineSelect) {
        disciplineSelect.addEventListener('change', function() {
            updateTopicPlaceholder(this.value);
            updateFocusPlaceholder(this.value);
            updateAdditionalPlaceholder(this.value);
            
            // Toggle Other discipline field
            const otherDisciplineGroup = document.getElementById('other-discipline-group');
            if (otherDisciplineGroup) {
                if (this.value === 'other') {
                    otherDisciplineGroup.style.display = 'block';
                    const otherDisciplineInput = document.getElementById('other-discipline');
                    if (otherDisciplineInput) {
                        setTimeout(() => otherDisciplineInput.focus(), 100);
                    }
                } else {
                    otherDisciplineGroup.style.display = 'none';
                }
            }
        });
    }
}

/**
 * Update the placeholder text for the paper topic field based on selected discipline
 * @param {string} discipline - The selected academic discipline
 */
function updateTopicPlaceholder(discipline) {
    const topicTextarea = document.getElementById('paper-topic');
    if (topicTextarea) {
        topicTextarea.placeholder = getPaperTopicSuggestion(discipline);
        
        // Auto-resize to fit new placeholder text
        setTimeout(() => {
            // Reset height to auto
            topicTextarea.style.height = 'auto';
            
            // Set height based on scrollHeight
            topicTextarea.style.height = Math.max(60, topicTextarea.scrollHeight) + 'px';
        }, 10);
    }
}

/**
 * Update the placeholder text for the paper focus field based on selected discipline
 * @param {string} discipline - The selected academic discipline
 */
function updateFocusPlaceholder(discipline) {
    const focusInput = document.getElementById('paper-focus');
    if (focusInput) {
        focusInput.placeholder = getPaperFocusSuggestion(discipline);
    }
}

/**
 * Update the placeholder text for the additional suggestions field based on selected discipline
 * @param {string} discipline - The selected academic discipline
 */
function updateAdditionalPlaceholder(discipline) {
    const additionalInput = document.getElementById('additional-suggestions');
    if (additionalInput) {
        additionalInput.placeholder = getAdditionalSuggestion(discipline);
    }
}

/**
 * Set up expandable fields that appear when a button is clicked
 */
function setupExpandableFields() {
    // Focus field expand button
    const focusExpandBtn = document.getElementById('expand-focus');
    const focusField = document.getElementById('focus-field-container');
    
    if (focusExpandBtn && focusField) {
        focusExpandBtn.addEventListener('click', function() {
            focusField.classList.add('expanded');
            this.style.display = 'none';
            
            // Update placeholder based on current discipline
            const discipline = document.getElementById('academic-discipline')?.value || '';
            updateFocusPlaceholder(discipline);
            
            // Focus the input after expanding
            setTimeout(() => {
                const paperFocus = document.getElementById('paper-focus');
                if (paperFocus) paperFocus.focus();
            }, 300);
        });
    }
    
    // Additional suggestions expand button
    const additionalExpandBtn = document.getElementById('expand-additional');
    const additionalField = document.getElementById('additional-field-container');
    
    if (additionalExpandBtn && additionalField) {
        additionalExpandBtn.addEventListener('click', function() {
            additionalField.classList.add('expanded');
            this.style.display = 'none';
            
            // Update placeholder based on current discipline
            const discipline = document.getElementById('academic-discipline')?.value || '';
            updateAdditionalPlaceholder(discipline);
            
            // Focus the textarea after expanding
            setTimeout(() => {
                const additionalSuggestions = document.getElementById('additional-suggestions');
                if (additionalSuggestions) additionalSuggestions.focus();
            }, 300);
        });
    }
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
    
    if (!paperTypePrice || !creativityPrice || !qualityPrice || !modalTotalPrice) {
        console.error('Price elements not found in the DOM');
        return;
    }
    
    // Get selected paper type
    const selectedPaperTypeEl = document.querySelector('input[name="paper-type"]:checked');
    if (!selectedPaperTypeEl) return;
    
    const selectedPaperType = selectedPaperTypeEl.value;
    const paperTypeValue = paperTypePrices[selectedPaperType];
    paperTypePrice.innerHTML = `<span>Paper type:</span><span>+$${paperTypeValue.toFixed(2)}</span>`;
    
    // Get creativity level
    const creativitySlider = document.getElementById('creativity-level');
    if (!creativitySlider) return;
    
    const creativityLevel = parseInt(creativitySlider.value);
    const creativityValue = creativityLevelPrices[creativityLevel - 1];
    creativityPrice.innerHTML = `<span>Creativity level:</span><span>+$${creativityValue.toFixed(2)}</span>`;
    
    // Get quality control
    const selectedQualityEl = document.querySelector('input[name="quality-control"]:checked');
    if (!selectedQualityEl) return;
    
    const selectedQuality = selectedQualityEl.value;
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