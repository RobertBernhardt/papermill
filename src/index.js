// "The only thing to do with good code is to pass it on. It is never of any use unexecuted."
// Main entry point for The Paper Mill application

// Import the modules
import { initHeader } from './components/header/header.js';
import { initFAQ } from './components/faq/faq.js';
import { initPricing } from './components/pricing/pricing.js';
import { initModal } from './components/modal/modal.js';
import { initEnhancedForm } from './components/modal/formInitializer.js';
import { initAdditionalModals } from './components/modal/additionalModals.js';
import { initTestimonials } from './components/testimonials/testimonials.js';
import { fadeInElements } from './utils/animations.js';
import { initPaperWizardAnimation } from './components/animations/paperWizardAnimation.js';
import { initExamples } from './components/examples/examples.js';
import { initExampleModal } from './components/examples/exampleModal.js';
import { initCookieNotice } from './components/cookie/cookieNotice.js';
// Import Stripe related modules
import { initStripePayment } from './components/payment/stripePayment.js';
import { initPaperFormStripeHandler } from './components/forms/paperFormStripeHandler.js';

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('The Paper Mill application initialized');
    
    // Initialize all components
    initHeader();
    initFAQ();
    initPricing();
    initEnhancedForm(); // Initialize the enhanced form before the modal
    initModal();
    initTestimonials();
    initAdditionalModals(); // This now includes legal content initialization
    initPaperWizardAnimation();
    initCookieNotice();
    
    // Initialize our new examples components
    initExampleModal(); // Initialize the modal first
    initExamples();     // Then initialize the examples
    
    // Initialize Stripe payment functionality
    initStripePayment();
    
    // Initialize the paper form handler with Stripe integration
    initPaperFormStripeHandler();
    
    // Apply animations
    fadeInElements();
    
    // For easier testing in console
    window.openLegalModal = function(type) {
        const modalTypes = {
            'terms': 'termsModal',
            'privacy': 'privacyModal',
            'imprint': 'imprintModal',
            'integrity': 'academicIntegrityModal'
        };
        
        const modalId = modalTypes[type];
        if (!modalId) return;
        
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Add animation class
            setTimeout(() => {
                const modalContainer = modal.querySelector('.modal-container');
                if (modalContainer) {
                    modalContainer.classList.add('modal-animate-in');
                }
            }, 10);
        }
    };
    
    // Add helper for opening example modals
    window.openExampleModal = function(exampleId) {
        // Import dynamically to avoid circular dependencies
        import('./components/examples/exampleModal.js').then(module => {
            module.openExampleModal(exampleId);
        });
    };
});