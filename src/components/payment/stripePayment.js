// Stripe Payment Module
// Handles Stripe payment processing and integration

// Initialize with your publishable key
let stripe;
let elements;
let cardElement;
let paymentFormVisible = false;

/**
 * Initialize the Stripe payment functionality
 */
export function initStripePayment() {
    // Initialize Stripe with your publishable key
    // Replace with your actual publishable key from Stripe dashboard
    stripe = Stripe('pk_test_51R6Y5kI2zLbwp9qJpwp7wocGiAGXSwLpPiCgSBUstMpLEcceQsev048HUZs7rZwJT7VOXnTDmMYeiHDoC361GvGo00oJ0kGCWz');
    
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
        paymentContainer.dataset.formData = JSON.stringify(formData);
        
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
        
        // Create payment intent on your server
        const paymentIntentResponse = await createPaymentIntent(formData);
        
        if (!paymentIntentResponse.clientSecret) {
            throw new Error('Could not retrieve payment intent');
        }
        
        // Confirm card payment
        const { error, paymentIntent } = await stripe.confirmCardPayment(
            paymentIntentResponse.clientSecret, {
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
        } else {
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
                    
                    // Show success message or redirect to success page
                    showSuccessMessage();
                }, 300);
            }, 1500);
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
 * Create a payment intent on the server
 * @param {Object} formData - The form data with pricing information
 * @returns {Promise<Object>} The payment intent response
 */
async function createPaymentIntent(formData) {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: formData.totalPrice, // in dollars
          currency: 'usd',
          metadata: {
            paperTopic: formData.paperTopic,
            academicDiscipline: formData.academicDiscipline,
            paperType: formData.paperType,
            email: formData.email
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error('Could not process payment. Please try again.');
    }
  }

/**
 * Notify the server that payment is complete
 * @param {string} paymentIntentId - The payment intent ID
 * @param {Object} formData - The original form data
 */
async function notifyServerPaymentComplete(paymentIntentId, formData) {
    // In a real application, this would call your server endpoint
    // For demo purposes, we'll simulate a server response
    
    try {
        // This would normally be a fetch call to your server
        // const response = await fetch('/api/payment-complete', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ paymentIntentId, formData })
        // });
        // return await response.json();
        
        // Simulated server response for demo
        return new Promise(resolve => {
            setTimeout(() => {
                console.log('Payment complete notification sent to server', {
                    paymentIntentId,
                    formData
                });
                resolve({ success: true });
            }, 500);
        });
    } catch (error) {
        console.error('Error notifying server about payment:', error);
        // We still consider payment successful even if this fails
        // The payment succeeded, but our server notification failed
    }
}

/**
 * Show a success message after payment
 */
function showSuccessMessage() {
    // Create success message element
    const successMessage = document.createElement('div');
    successMessage.className = 'payment-success-message';
    successMessage.innerHTML = `
        <div class="success-content">
            <div class="success-icon">
                <svg viewBox="0 0 24 24" width="48" height="48">
                    <path fill="#4CAF50" d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M10,17l-5-5l1.41-1.41L10,14.17l7.59-7.59L19,8L10,17z"/>
                </svg>
            </div>
            <h3>Payment Successful!</h3>
            <p>Your paper is being generated. We'll send it to your email when it's ready.</p>
            <button class="cta-button primary" id="success-close">Done</button>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(successMessage);
    
    // Add animation
    setTimeout(() => {
        successMessage.classList.add('visible');
    }, 10);
    
    // Add close button handler
    const closeButton = successMessage.querySelector('#success-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            successMessage.classList.remove('visible');
            setTimeout(() => {
                document.body.removeChild(successMessage);
            }, 300);
        });
    }
}