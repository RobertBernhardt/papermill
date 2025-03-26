// Stripe Payment Module
// Handles Stripe payment processing and integration

// Initialize variables
let stripe;
let elements;
let cardElement;
let paymentFormVisible = false;
let clientSecret = null;

/**
 * Initialize the Stripe payment functionality
 */
export function initStripePayment() {
    // Initialize Stripe with your publishable key
    // Replace with your actual publishable key from Stripe dashboard or environment variable
    const stripePublicKey = 'pk_test_51R6Y5kI2zLbwp9qJpwp7wocGiAGXSwLpPiCgSBUstMpLEcceQsev048HUZs7rZwJT7VOXnTDmMYeiHDoC361GvGo00oJ0kGCWz';
    stripe = Stripe(stripePublicKey);
    
    // Create and inject payment form HTML
    createPaymentForm();
}

/**
 * Create and inject the Stripe payment form
 */
function createPaymentForm() {
    const paperFormModal = document.getElementById('paperFormModal');
    if (!paperFormModal) return;
    
    // Create payment form container
    const paymentContainer = document.createElement('div');
    paymentContainer.className = 'payment-container';
    paymentContainer.id = 'payment-container';
    paymentContainer.style.display = 'none'; // Initially hidden
    
    // Set up payment form HTML
    paymentContainer.innerHTML = `
        <div class="payment-form-wrapper">
            <h3>Payment Details</h3>
            <p class="payment-subtitle">Your paper will be delivered after payment is processed</p>
            
            <form id="payment-form" class="payment-form">
                <div class="form-group">
                    <label for="card-element">Credit or debit card</label>
                    <div id="card-element" class="card-element"></div>
                    <div id="card-errors" class="card-errors" role="alert"></div>
                </div>
                
                <div class="payment-summary">
                    <div class="price-row total">
                        <span>Total Payment:</span>
                        <span id="payment-amount" class="payment-amount">$5.00</span>
                    </div>
                </div>
                
                <button type="submit" id="submit-payment" class="cta-button primary full-width">
                    <div class="spinner hidden" id="spinner"></div>
                    <span id="button-text">Pay Now</span>
                </button>
                
                <p class="payment-security-note">
                    <svg viewBox="0 0 24 24" width="16" height="16">
                        <path d="M12,1L3,5v6c0,5.55,3.84,10.74,9,12c5.16-1.26,9-6.45,9-12V5L12,1z M12,11.99h7c-0.53,4.12-3.28,7.79-7,8.94V12H5V6.3l7-3.11v8.8z"/>
                    </svg>
                    Payments are securely processed by Stripe. We never store your card details.
                </p>
            </form>
            
            <button id="back-to-form" class="back-button">
                <svg viewBox="0 0 24 24" width="16" height="16">
                    <path d="M20,11H7.83l5.59-5.59L12,4l-8,8l8,8l1.41-1.41L7.83,13H20V11z"/>
                </svg>
                Back to paper details
            </button>
        </div>
    `;
    
    // Add to paper form modal
    const modalBody = paperFormModal.querySelector('.modal-body');
    if (modalBody) {
        modalBody.appendChild(paymentContainer);
        
        // Set up event listeners after adding to DOM
        setupPaymentEventListeners();
    }
}

/**
 * Set up the Stripe card element and event listeners
 */
function setupPaymentEventListeners() {
    const backButton = document.getElementById('back-to-form');
    if (backButton) {
        backButton.addEventListener('click', () => {
            togglePaymentForm(false);
        });
    }
    
    // Set up the payment form submission handler
    const form = document.getElementById('payment-form');
    if (form) {
        form.addEventListener('submit', handlePaymentSubmission);
    }
}

/**
 * Initialize the Stripe card element
 */
function initializeCardElement() {
    // Only initialize once
    if (cardElement) return;
    
    // Create Elements instance
    elements = stripe.elements();
    
    // Create and mount the Card Element
    cardElement = elements.create('card', {
        style: {
            base: {
                color: '#32325d',
                fontFamily: '"Montserrat", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4'
                }
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
            }
        }
    });
    
    // Mount the card element
    cardElement.mount('#card-element');
    
    // Handle real-time validation errors
    cardElement.on('change', ({error}) => {
        const displayError = document.getElementById('card-errors');
        if (error) {
            displayError.textContent = error.message;
        } else {
            displayError.textContent = '';
        }
    });
}

/**
 * Toggle between paper form and payment form
 * @param {boolean} showPayment - Whether to show the payment form
 * @param {Object} formData - Form data to pass to payment (when showing payment)
 */
export function togglePaymentForm(showPayment, formData = null) {
    const paperForm = document.querySelector('.paper-form');
    const paymentContainer = document.getElementById('payment-container');
    
    if (!paperForm || !paymentContainer) return;
    
    if (showPayment) {
        // Store form data for later use
        if (formData) {
            paymentContainer.dataset.formData = JSON.stringify(formData);
            
            // Store client secret from payment intent response
            if (formData.clientSecret) {
                clientSecret = formData.clientSecret;
            }
        }
        
        // Update payment amount display
        const paymentAmount = document.getElementById('payment-amount');
        if (paymentAmount && formData && formData.totalPrice) {
            paymentAmount.textContent = `$${formData.totalPrice.toFixed(2)}`;
        }
        
        // Hide paper form, show payment form
        paperForm.style.display = 'none';
        paymentContainer.style.display = 'block';
        paymentFormVisible = true;
        
        // Initialize card element when first showing payment form
        initializeCardElement();
        
        // Scroll to top of modal
        const modalBody = document.querySelector('#paperFormModal .modal-body');
        if (modalBody) {
            modalBody.scrollTop = 0;
        }
    } else {
        // Hide payment form, show paper form
        paymentContainer.style.display = 'none';
        paperForm.style.display = 'block';
        paymentFormVisible = false;
    }
}

/**
 * Check if payment form is currently visible
 * @returns {boolean} Whether payment form is visible
 */
export function isPaymentFormVisible() {
    return paymentFormVisible;
}

/**
 * Handle payment form submission
 * @param {Event} event - The submission event
 */
async function handlePaymentSubmission(event) {
    event.preventDefault();
    
    const submitButton = document.getElementById('submit-payment');
    const buttonText = document.getElementById('button-text');
    const spinner = document.getElementById('spinner');
    
    if (!submitButton || !buttonText || !spinner) return;
    
    // Disable the submit button and show spinner
    submitButton.disabled = true;
    spinner.classList.remove('hidden');
    buttonText.textContent = 'Processing...';
    
    try {
        // Get the form data that was stored when showing payment form
        const paymentContainer = document.getElementById('payment-container');
        const formDataStr = paymentContainer?.dataset.formData;
        const formData = formDataStr ? JSON.parse(formDataStr) : null;
        
        if (!formData) {
            throw new Error('Form data not found');
        }
        
        // If we don't have a client secret in memory, get it from formData
        if (!clientSecret && formData.clientSecret) {
            clientSecret = formData.clientSecret;
        }
        
        // Validate we have a client secret
        if (!clientSecret) {
            throw new Error('Missing payment information. Please try again.');
        }
        
        // Confirm card payment
        const { error, paymentIntent } = await stripe.confirmCardPayment(
            clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        email: formData.email
                    }
                }
            }
        );
        
        if (error) {
            // Show error to customer
            const errorElement = document.getElementById('card-errors');
            errorElement.textContent = error.message;
            
            // Reset button
            submitButton.disabled = false;
            spinner.classList.add('hidden');
            buttonText.textContent = 'Pay Now';
        } else if (paymentIntent.status === 'succeeded') {
            // Payment succeeded
            buttonText.textContent = 'Payment Successful!';
            
            // Here you would typically:
            // 1. Notify your server about successful payment
            // 2. Generate the paper
            // 3. Send confirmation email
            await notifyServerPaymentComplete(paymentIntent.id, formData);
            
            // Close modal after a delay
            setTimeout(() => {
                // Close modal
                const modal = document.getElementById('paperFormModal');
                if (modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
                
                // Reset forms
                setTimeout(() => {
                    // Reset payment form
                    const paymentForm = document.getElementById('payment-form');
                    if (paymentForm) paymentForm.reset();
                    
                    // Hide payment form, show paper form for next time
                    togglePaymentForm(false);
                    
                    // Reset button
                    submitButton.disabled = false;
                    spinner.classList.add('hidden');
                    buttonText.textContent = 'Pay Now';
                    
                    // Reset paper form
                    const paperForm = document.querySelector('.paper-form');
                    if (paperForm) paperForm.reset();
                    
                    // Show success message
                    showSuccessMessage(formData);
                    
                    // Clear client secret after successful payment
                    clientSecret = null;
                }, 300);
            }, 1500);
        } else {
            // Payment requires additional action
            buttonText.textContent = 'Additional verification required...';
            console.log('Payment requires additional action:', paymentIntent.status);
        }
    } catch (error) {
        console.error('Payment error:', error);
        
        // Show error message
        const errorElement = document.getElementById('card-errors');
        errorElement.textContent = error.message || 'An unexpected error occurred.';
        
        // Reset button
        submitButton.disabled = false;
        spinner.classList.add('hidden');
        buttonText.textContent = 'Pay Now';
    }
}

/**
 * Notify the server that payment is complete
 * @param {string} paymentIntentId - The payment intent ID
 * @param {Object} formData - The original form data
 */
async function notifyServerPaymentComplete(paymentIntentId, formData) {
    try {
        // In a real implementation, this would call an API endpoint
        // For now, we'll just log to the console
        console.log('Payment complete notification would be sent to server', {
            paymentIntentId,
            formData
        });
        
        // In a real implementation:
        // const response = await fetch('/api/payment-complete', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ paymentIntentId, formData })
        // });
        // return await response.json();
        
        return { success: true };
    } catch (error) {
        console.error('Error notifying server about payment:', error);
        // We still consider payment successful even if this fails
        // The payment succeeded, but our server notification failed
        return { success: false, error: error.message };
    }
}

/**
 * Show a success message after payment
 * @param {Object} formData - The form data with payment details
 */
function showSuccessMessage(formData) {
    // Create success message element
    const successMessage = document.createElement('div');
    successMessage.className = 'payment-success-message';
    successMessage.style.position = 'fixed';
    successMessage.style.top = '0';
    successMessage.style.left = '0';
    successMessage.style.right = '0';
    successMessage.style.bottom = '0';
    successMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    successMessage.style.display = 'flex';
    successMessage.style.justifyContent = 'center';
    successMessage.style.alignItems = 'center';
    successMessage.style.zIndex = '9999';
    successMessage.style.opacity = '0';
    successMessage.style.transition = 'opacity 0.3s ease';
    
    // Format paper topic for display
    const paperTopic = formData.paperTopic || 'your requested topic';
    const email = formData.email || 'your email';
    
    // Create success message content
    successMessage.innerHTML = `
        <div style="background-color: white; padding: 30px; border-radius: 8px; max-width: 500px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
            <div style="margin-bottom: 20px; color: #4CAF50;">
                <svg viewBox="0 0 24 24" width="60" height="60">
                    <path fill="#4CAF50" d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M10,17l-5-5l1.41-1.41L10,14.17l7.59-7.59L19,8L10,17z"/>
                </svg>
            </div>
            <h2 style="color: #333; margin-bottom: 15px;">Payment Successful!</h2>
            <p style="color: #666; margin-bottom: 20px;">
                Your paper on <strong>"${paperTopic}"</strong> is being generated.<br>
                We'll send it to <strong>${email}</strong> when it's ready.
            </p>
            <button id="success-close-btn" style="background-color: #FFD166; color: #333; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: bold;">Close</button>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(successMessage);
    
    // Add animation
    setTimeout(() => {
        successMessage.style.opacity = '1';
    }, 10);
    
    // Add close button handler
    const closeButton = successMessage.querySelector('#success-close-btn');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            successMessage.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(successMessage);
            }, 300);
        });
    }
}