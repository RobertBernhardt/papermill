// "The only thing to do with good code is to pass it on. It is never of any use unexecuted."
// Main entry point for The Paper Mill application

// Import the modules
import { initFAQ } from './components/faq/faq.js';
import { initPricing } from './components/pricing/pricing.js';
import { initModal } from './components/modal/modal.js';
import { initTestimonials } from './components/testimonials/testimonials.js';
import { fadeInElements } from './utils/animations.js';

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('The Paper Mill application initialized');
    
    // Initialize all components
    initFAQ();
    initPricing();
    initModal();
    initTestimonials();
    
    // Apply animations
    fadeInElements();
});