// Form Initializer Module
// Handles the initialization of the enhanced paper form

import { getPaperFormTemplate, initCharCounter } from './paperFormTemplate.js';

/**
 * Initialize the enhanced paper form
 */
export function initEnhancedForm() {
    // Replace the current form with our enhanced template
    replaceFormContent();
    
    // Initialize the character counter after form is loaded
    setTimeout(() => {
        initCharCounter();
        
        // Auto-resize the paper topic textarea to fit content
        const paperTopicTextarea = document.getElementById('paper-topic');
        if (paperTopicTextarea) {
            // Initial resize
            autoResizeTextarea(paperTopicTextarea);
            
            // Set up input event listener for future resizing
            paperTopicTextarea.addEventListener('input', function() {
                autoResizeTextarea(this);
            });
            
            // Resize when placeholder text is replaced with actual input
            paperTopicTextarea.addEventListener('focus', function() {
                setTimeout(() => autoResizeTextarea(this), 100);
            });
        }
    }, 100);
}

/**
 * Replace the existing form content with our enhanced template
 */
function replaceFormContent() {
    const modalBody = document.querySelector('#paperFormModal .modal-body');
    
    if (modalBody) {
        // Store the existing form to check if it exists
        const existingForm = modalBody.querySelector('.paper-form');
        
        // Only replace if the form exists
        if (existingForm) {
            // Get our enhanced form template
            const enhancedFormTemplate = getPaperFormTemplate();
            
            // Replace the existing form
            existingForm.outerHTML = enhancedFormTemplate;
        }
    }
}

/**
 * Auto-resize a textarea based on its content
 * @param {HTMLElement} textarea - The textarea element to resize
 */
function autoResizeTextarea(textarea) {
    // Reset height to allow shrinking
    textarea.style.height = 'auto';
    
    // Set height based on scrollHeight (plus a little extra for padding)
    const computed = window.getComputedStyle(textarea);
    const paddingTop = parseFloat(computed.paddingTop);
    const paddingBottom = parseFloat(computed.paddingBottom);
    
    // Ensure at least 2 rows of text
    const minHeight = 60; // 2 lines approximately
    const contentHeight = textarea.scrollHeight - paddingTop - paddingBottom;
    
    textarea.style.height = Math.max(minHeight, contentHeight) + 'px';
}