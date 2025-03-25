// Form Initializer Module
// Handles the initialization of the enhanced paper form

import { getPaperFormTemplate } from './paperFormTemplate.js';

// Flag to track if initialization has already happened
let initialized = false;

/**
 * Initialize the enhanced paper form
 */
export function initEnhancedForm() {
    // Only initialize once to prevent duplication of event handlers
    if (initialized) {
        console.log('Form already initialized, skipping');
        return;
    }
    
    // Replace the current form with our enhanced template
    const success = replaceFormContent();
    
    if (success) {
        // Set up event listeners for the form AFTER the replacement is complete
        setupFormEventListeners();
        
        // Mark as initialized
        initialized = true;
        console.log('Enhanced form initialized successfully');
    }
}

/**
 * Replace the existing form content with our enhanced template
 * @returns {boolean} Whether the replacement was successful
 */
function replaceFormContent() {
    const modalBody = document.querySelector('#paperFormModal .modal-body');
    
    if (!modalBody) {
        console.error('Modal body not found');
        return false;
    }
    
    // Store the existing form to check if it exists
    const existingForm = modalBody.querySelector('.paper-form');
    
    // Only replace if the form exists
    if (existingForm) {
        // Get our enhanced form template
        const enhancedFormTemplate = getPaperFormTemplate();
        
        // Replace the existing form with our new HTML
        existingForm.outerHTML = enhancedFormTemplate;
        return true;
    }
    
    console.error('Existing form not found');
    return false;
}

/**
 * Set up event listeners for the form elements
 */
function setupFormEventListeners() {
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
    
    // Initialize character counter for the focus textarea
    const focusTextarea = document.getElementById('paper-focus');
    const charCount = document.getElementById('focus-char-count');
    
    if (focusTextarea && charCount) {
        // Set initial character count to 0
        charCount.textContent = '0';
        
        focusTextarea.addEventListener('input', function() {
            charCount.textContent = this.value.length;
            
            // Add warning class if approaching limit
            if (this.value.length > 180) {
                charCount.classList.add('char-count-warning');
            } else {
                charCount.classList.remove('char-count-warning');
            }
        });
    }
    
    // Initially hide "other" discipline field
    const otherDisciplineGroup = document.getElementById('other-discipline-group');
    if (otherDisciplineGroup) {
        otherDisciplineGroup.style.display = 'none';
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