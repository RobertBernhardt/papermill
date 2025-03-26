// Paper Form Stripe Handler Module
// Enhanced paper form handler with Stripe payment integration

import { togglePaymentForm, isPaymentFormVisible } from '../payment/stripePayment.js';

/**
 * Initialize the paper form handler with Stripe integration
 */
export function initPaperFormStripeHandler() {
    console.log('Initializing paper form handler with Stripe integration...');
    
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
    
    // Add back button functionality for the Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && isPaymentFormVisible()) {
            // If payment form is visible, go back to paper form
            togglePaymentForm(false);
            // Prevent modal from closing
            event.stopPropagation();
        }
    });
    
    console.log('Paper form handler with Stripe integration attached successfully');
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
    
    // Get the container for later use
    const modalBody = document.querySelector('#paperFormModal .modal-body');
    
    // Remember current scroll position for potential restoration
    const currentScrollPosition = modalBody ? modalBody.scrollTop : 0;
    
    // Validate form inputs
    const validationResult = validateForm(form);
    
    // If validation failed, don't proceed
    if (!validationResult.valid) {
        console.log('Form validation failed:', validationResult.errors);
        
        // Scroll to the first error field
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
    
    // Prepare request data for the payment intent
    const requestData = {
        amount: formData.totalPrice,
        currency: 'usd',
        metadata: {
            paperTopic: formData.paperTopic,
            academicDiscipline: formData.academicDiscipline,
            paperType: formData.paperType,
            creativityLevel: formData.creativityLevel,
            qualityControl: formData.qualityControl,
            email: formData.email
        }
    };
    
    console.log('Sending payment intent request:', requestData);
    
    // Make the API call with better error handling
    fetch('/api/create-payment-intent.js', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (!response.ok) {
            // Try to get more detail from the error response
            return response.json().then(errData => {
                throw new Error(errData.error || `HTTP error! status: ${response.status}`);
            }).catch(jsonErr => {
                // If we couldn't parse JSON, just use the status
                throw new Error(`HTTP error! status: ${response.status}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Payment intent created successfully:', data);
        
        // Reset the button after success
        if (submitButton) {
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }
        
        // Show the Stripe payment form
        togglePaymentForm(true, formData);
    })
    .catch(error => {
        console.error('Error creating payment intent:', error);
        
        // Show error message
        alert(`Payment error: ${error.message || 'Unknown error'}. Please check the console for more details.`);
        
        // Reset button
        if (submitButton) {
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
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
    } else if (!isValidEmail(email)) {
        isValid = false;
        errors.email = 'Please enter a valid email address';
        
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
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Scroll to an element in the modal
 * @param {HTMLElement} element - The element to scroll to
 * @param {HTMLElement} container - The scrollable container
 */
function scrollToElement(element, container) {
    if (!element || !container) return;
    
    // Calculate the target position with some margin
    const targetPosition = element.offsetTop - 20;
    
    // Smooth scroll to element
    container.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
    
    // Highlight the element
    element.classList.add('highlight-field');
    
    // Remove highlight after a delay
    setTimeout(() => {
        element.classList.remove('highlight-field');
    }, 1500);
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
    
    // Calculate total price
    const basePrice = 5;
    
    // Paper type pricing
    const paperTypePrices = {
        'seminar': 0,
        'bachelor': 10,
        'master': 15,
        'academic': 20,
        'phd': 30
    };
    const paperTypePrice = paperTypePrices[paperType] || 0;
    
    // Creativity level pricing
    const creativityLevelPrices = [0, 5, 10, 15, 25]; // index corresponds to level - 1
    const creativityIndex = parseInt(creativityLevel) - 1;
    const creativityPrice = creativityLevelPrices[creativityIndex] || 0;
    
    // Quality control pricing
    const qualityControlPrices = {
        'basic': 0,
        'advanced': 10,
        'hardcore': 25
    };
    const qualityPrice = qualityControlPrices[qualityControl] || 0;
    
    // Calculate total
    const totalPrice = basePrice + paperTypePrice + creativityPrice + qualityPrice;
    
    return {
        paperTopic,
        academicDiscipline: finalDiscipline,
        originalDiscipline: academicDiscipline,
        paperType,
        creativityLevel,
        qualityControl,
        email,
        paperFocus,
        additionalSuggestions,
        basePrice,
        paperTypePrice,
        creativityPrice,
        qualityPrice,
        totalPrice
    };
}