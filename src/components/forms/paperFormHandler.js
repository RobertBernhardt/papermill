// Paper Form Handler Module
// Dedicated module that handles paper form validation and submission

/**
 * Initialize the paper form handler
 */
export function initPaperFormHandler() {
    console.log('Initializing paper form handler...');
    
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', () => {
        // Use a short delay to ensure the form is fully initialized
        setTimeout(attachFormSubmitHandler, 500);
    });
}

/**
 * Attach form submission handler to the paper form
 */
function attachFormSubmitHandler() {
    const paperFormModal = document.getElementById('paperFormModal');
    if (!paperFormModal) {
        console.error('Paper form modal not found');
        return;
    }
    
    const paperForm = paperFormModal.querySelector('.paper-form');
    if (!paperForm) {
        console.error('Paper form not found in modal');
        return;
    }
    
    // Remove any existing listeners by cloning the form
    const newForm = paperForm.cloneNode(true);
    paperForm.parentNode.replaceChild(newForm, paperForm);
    
    // Add event listener to the form
    newForm.addEventListener('submit', handleFormSubmission);
    
    // Also attach a click handler to the submit button as a fallback
    const submitButton = newForm.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.addEventListener('click', function(e) {
            // Prevent default click behavior to avoid scrolling
            e.preventDefault();
            e.stopPropagation();
            
            // Run validation without submitting the form
            handleFormSubmission(e);
        });
    }
    
    console.log('Paper form handler attached successfully');
}

/**
 * Handle form submission
 * @param {Event} event - The submission event 
 */
function handleFormSubmission(event) {
    // Always prevent default to stop unwanted scrolling
    event.preventDefault();
    event.stopPropagation();
    
    console.log('Form submission handler triggered');
    
    // Get the form reference
    const form = event.target.closest('.paper-form');
    if (!form) {
        console.error('Form not found');
        return;
    }
    
    // Get submit button for UI updates
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.textContent : 'Generate My Paper';
    
    // Save the current scroll position in the modal
    const modalBody = document.querySelector('#paperFormModal .modal-body');
    const scrollTop = modalBody ? modalBody.scrollTop : 0;
    
    // Validate form inputs
    const validationResult = validateForm(form);
    
    // Restore scroll position
    if (modalBody) {
        modalBody.scrollTop = scrollTop;
    }
    
    // If validation failed, don't proceed
    if (!validationResult.valid) {
        console.log('Form validation failed:', validationResult.errors);
        
        // Scroll to the first error field with smooth animation
        if (validationResult.firstErrorElement) {
            scrollToElement(validationResult.firstErrorElement, modalBody);
        }
        return;
    }
    
    // Collect form data
    const formData = collectFormData(form);
    console.log('Form data:', formData);
    
    // Update UI to show we're processing
    if (submitButton) {
        submitButton.textContent = 'Processing...';
        submitButton.disabled = true;
    }
    
    // Simulate API call (in real app, replace with actual API call)
    simulateApiCall(formData)
        .then(response => {
            console.log('API call successful:', response);
            
            // Update UI for success
            if (submitButton) {
                submitButton.textContent = 'Success!';
            }
            
            // Close modal after a delay
            setTimeout(() => {
                const modal = document.getElementById('paperFormModal');
                if (modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                    
                    // Reset form only AFTER the modal is closed
                    setTimeout(() => {
                        if (submitButton) {
                            submitButton.textContent = originalButtonText;
                            submitButton.disabled = false;
                        }
                        form.reset();
                        
                        // Reset other UI elements
                        const otherDisciplineGroup = document.getElementById('other-discipline-group');
                        if (otherDisciplineGroup) {
                            otherDisciplineGroup.style.display = 'none';
                        }
                        
                        resetExpandableFields();
                    }, 300);
                }
            }, 1500);
        })
        .catch(error => {
            console.error('API call failed:', error);
            
            // Update UI for error
            if (submitButton) {
                submitButton.textContent = 'Error! Try Again';
                
                // Reset button after a delay
                setTimeout(() => {
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                }, 2000);
            }
        });
}

/**
 * Validate all form fields
 * @param {HTMLFormElement} form - The form to validate
 * @returns {Object} Validation result with valid flag and errors
 */
function validateForm(form) {
    let isValid = true;
    const errors = {};
    let firstErrorElement = null;
    
    // Paper topic validation
    const paperTopicField = form.querySelector('#paper-topic');
    const paperTopic = paperTopicField ? paperTopicField.value.trim() : '';
    
    if (!paperTopic) {
        isValid = false;
        errors.paperTopic = 'Paper topic is required';
        
        // Add visual error indication
        if (paperTopicField) {
            paperTopicField.classList.add('error-field');
            // Don't focus immediately to prevent scroll jump
            setTimeout(() => paperTopicField.classList.remove('error-field'), 3000);
            
            // Save as first error if we haven't found one yet
            if (!firstErrorElement) {
                firstErrorElement = paperTopicField;
            }
        }
    }
    
    // Academic discipline validation
    const disciplineField = form.querySelector('#academic-discipline');
    const discipline = disciplineField ? disciplineField.value : '';
    
    if (!discipline) {
        isValid = false;
        errors.discipline = 'Academic discipline is required';
        
        // Add visual error indication
        if (disciplineField) {
            disciplineField.classList.add('error-field');
            setTimeout(() => disciplineField.classList.remove('error-field'), 3000);
            
            // Save as first error if we haven't found one yet
            if (!firstErrorElement) {
                firstErrorElement = disciplineField;
            }
        }
    }
    
    // Other discipline validation
    if (discipline === 'other') {
        const otherDisciplineField = form.querySelector('#other-discipline');
        const otherDiscipline = otherDisciplineField ? otherDisciplineField.value.trim() : '';
        
        if (!otherDiscipline) {
            isValid = false;
            errors.otherDiscipline = 'Please specify your discipline';
            
            // Add visual error indication
            if (otherDisciplineField) {
                otherDisciplineField.classList.add('error-field');
                setTimeout(() => otherDisciplineField.classList.remove('error-field'), 3000);
                
                // Save as first error if we haven't found one yet
                if (!firstErrorElement) {
                    firstErrorElement = otherDisciplineField;
                }
            }
        }
    }
    
    // Email validation
    const emailField = form.querySelector('#email');
    const email = emailField ? emailField.value.trim() : '';
    
    if (!email) {
        isValid = false;
        errors.email = 'Email is required';
        
        // Add visual error indication
        if (emailField) {
            emailField.classList.add('error-field');
            setTimeout(() => emailField.classList.remove('error-field'), 3000);
            
            // Save as first error if we haven't found one yet
            if (!firstErrorElement) {
                firstErrorElement = emailField;
            }
        }
    }
    
    return {
        valid: isValid,
        errors: errors,
        firstErrorElement: firstErrorElement
    };
}

/**
 * Scroll smoothly to an element within a container
 * @param {HTMLElement} element - The element to scroll to
 * @param {HTMLElement} container - The scrollable container
 */
function scrollToElement(element, container) {
    if (!element || !container) return;
    
    // Calculate element position relative to container
    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    // Calculate where to scroll to (element position - some offset for better viewing)
    const scrollOffset = elementRect.top - containerRect.top - 20;
    
    // Smooth scroll to the element
    container.scrollBy({
        top: scrollOffset,
        behavior: 'smooth'
    });
    
    // Focus the element after scrolling
    setTimeout(() => {
        element.focus({preventScroll: true});
    }, 500);
    
    // Add a temporary highlight effect
    element.classList.add('highlight-field');
    setTimeout(() => {
        element.classList.remove('highlight-field');
    }, 2000);
}

/**
 * Collect all form data into an object
 * @param {HTMLFormElement} form - The form to collect data from
 * @returns {Object} The collected form data
 */
function collectFormData(form) {
    // Get basic fields
    const paperTopic = form.querySelector('#paper-topic').value.trim();
    const academicDiscipline = form.querySelector('#academic-discipline').value;
    const email = form.querySelector('#email').value.trim();
    
    // Handle "other" discipline
    let finalDiscipline = academicDiscipline;
    if (academicDiscipline === 'other') {
        finalDiscipline = form.querySelector('#other-discipline').value.trim();
    }
    
    // Get selected paper type
    const paperTypeElem = form.querySelector('input[name="paper-type"]:checked');
    const paperType = paperTypeElem ? paperTypeElem.value : 'seminar';
    
    // Get creativity level
    const creativityLevelElem = form.querySelector('#creativity-level');
    const creativityLevel = creativityLevelElem ? creativityLevelElem.value : '1';
    
    // Get quality control
    const qualityControlElem = form.querySelector('input[name="quality-control"]:checked');
    const qualityControl = qualityControlElem ? qualityControlElem.value : 'basic';
    
    // Get optional fields
    const paperFocusElem = form.querySelector('#paper-focus');
    const paperFocus = paperFocusElem ? paperFocusElem.value.trim() : '';
    
    const additionalSuggestionsElem = form.querySelector('#additional-suggestions');
    const additionalSuggestions = additionalSuggestionsElem ? additionalSuggestionsElem.value.trim() : '';
    
    return {
        paperTopic,
        academicDiscipline: finalDiscipline,
        originalDiscipline: academicDiscipline,
        paperType,
        creativityLevel,
        qualityControl,
        email,
        paperFocus,
        additionalSuggestions
    };
}

/**
 * Simulate an API call for testing
 * @param {Object} formData - The form data to send 
 * @returns {Promise} A promise that resolves with the API response
 */
function simulateApiCall(formData) {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            // Simulate successful response
            resolve({
                success: true,
                message: 'Paper request received successfully',
                orderId: 'PM-' + Math.floor(Math.random() * 1000000),
                estimatedDelivery: '15 minutes'
            });
            
            // Uncomment to simulate error
            /*
            reject({
                error: 'API error',
                message: 'Could not process request'
            });
            */
        }, 1500);
    });
}

/**
 * Reset expandable fields to collapsed state
 */
function resetExpandableFields() {
    const focusField = document.getElementById('focus-field-container');
    const focusExpandBtn = document.getElementById('expand-focus');
    const additionalField = document.getElementById('additional-field-container');
    const additionalExpandBtn = document.getElementById('expand-additional');
    
    if (focusField && focusExpandBtn) {
        focusField.classList.remove('expanded');
        focusExpandBtn.style.display = 'block';
    }
    
    if (additionalField && additionalExpandBtn) {
        additionalField.classList.remove('expanded');
        additionalExpandBtn.style.display = 'block';
    }
}