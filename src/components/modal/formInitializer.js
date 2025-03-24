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
    
    // Set up the form submission handler
    const paperForm = document.querySelector('.paper-form');
    if (paperForm) {
        // Prevent the default form submission to avoid page reloads
        paperForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submission intercepted');
            
            // Don't do anything else here - we'll handle submission elsewhere
        });
        
        // The actual submission will be handled by the submit button click handler
        const submitButton = paperForm.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.addEventListener('click', handleFormSubmission);
        }
    }
}

/**
 * Handle form submission - this is where we send the data
 * @param {Event} event - The click event
 */
function handleFormSubmission(event) {
    event.preventDefault();
    console.log('Submit button clicked');
    
    // Get the form
    const form = event.target.closest('form');
    if (!form) {
        console.error('Form not found');
        return;
    }
    
    // Get form values
    const formData = new FormData(form);
    const paperTopic = formData.get('paper-topic') || '';
    const academicDiscipline = formData.get('academic-discipline') || '';
    const paperType = document.querySelector('input[name="paper-type"]:checked')?.value || 'seminar';
    const creativityLevel = document.getElementById('creativity-level')?.value || '1';
    const qualityControl = document.querySelector('input[name="quality-control"]:checked')?.value || 'basic';
    const email = formData.get('email') || '';
    const paperFocus = formData.get('paper-focus') || '';
    const additionalSuggestions = formData.get('additional-suggestions') || '';
    
    // Validate required fields
    let hasErrors = false;
    
    if (!paperTopic) {
        // Show elegant inline validation
        const topicField = document.getElementById('paper-topic');
        if (topicField) {
            topicField.classList.add('error-field');
            setTimeout(() => topicField.classList.remove('error-field'), 3000);
            topicField.focus();
        }
        hasErrors = true;
    }
    
    if (!academicDiscipline) {
        const disciplineField = document.getElementById('academic-discipline');
        if (disciplineField) {
            disciplineField.classList.add('error-field');
            setTimeout(() => disciplineField.classList.remove('error-field'), 3000);
            if (!hasErrors) disciplineField.focus();
        }
        hasErrors = true;
    }
    
    if (!email) {
        const emailField = document.getElementById('email');
        if (emailField) {
            emailField.classList.add('error-field');
            setTimeout(() => emailField.classList.remove('error-field'), 3000);
            if (!hasErrors) emailField.focus();
        }
        hasErrors = true;
    }
    
    if (hasErrors) {
        return;
    }
    
    // Prepare request data
    const requestData = {
        paperTopic,
        academicDiscipline,
        paperType,
        creativityLevel,
        qualityControl,
        email,
        paperFocus,
        additionalSuggestions
    };
    
    // Update UI to show processing
    const submitButton = event.target;
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Processing...';
    submitButton.disabled = true;
    
    // Send the data to the server
    console.log('Sending request data:', requestData);
    
    fetch('http://localhost:3000/api/papers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Paper request successful:', data);
        
        // Success handling
        submitButton.textContent = 'Success! Redirecting...';
        
        // Close modal after delay
        setTimeout(() => {
            const modal = document.getElementById('paperFormModal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
                
                // Reset form for next time
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    if (form) form.reset();
                }, 500);
            }
        }, 1500);
    })
    .catch(error => {
        console.error('Failed to submit paper request:', error);
        
        // Error handling
        submitButton.textContent = 'Error! Please try again';
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 2000);
    });
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