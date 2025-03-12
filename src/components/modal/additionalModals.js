// Additional Modals Module
// Handles contact form modal and legal modals functionality

import { initLegalContent } from '../legal/legalContent.js';

/**
 * Initialize the additional modals functionality
 */
export function initAdditionalModals() {
    setupContactModal();
    setupLegalModals();
    
    // Initialize the legal content module after modals are set up
    initLegalContent();
}

/**
 * Set up the contact modal
 */
function setupContactModal() {
    // Get the contact modal and its elements
    const contactModal = document.getElementById('contactModal');
    if (!contactModal) return;
    
    const contactModalClose = contactModal.querySelector('.modal-close');
    const contactForm = contactModal.querySelector('form');
    
    // Add event listeners to contact modal triggers
    const contactTriggers = document.querySelectorAll('[data-modal="contact"]');
    contactTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(contactModal);
        });
    });
    
    // Close modal when clicking the close button
    contactModalClose.addEventListener('click', () => closeModal(contactModal));
    
    // Close modal when clicking outside the modal content
    contactModal.addEventListener('click', function(event) {
        if (event.target === contactModal) {
            closeModal(contactModal);
        }
    });
    
    // Handle form submission if a form exists
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Simulate form submission
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Simulate API call with timeout
            setTimeout(() => {
                // Here you would normally send data to server
                console.log('Contact form submitted');
                
                // Reset button
                submitButton.textContent = 'Message Sent!';
                
                // Close modal after delay
                setTimeout(() => {
                    closeModal(contactModal);
                    // Reset button text after modal is closed
                    setTimeout(() => {
                        submitButton.textContent = originalText;
                        submitButton.disabled = false;
                        contactForm.reset();
                    }, 500);
                }, 1500);
            }, 1500);
        });
    }
}

/**
 * Set up legal modals (Terms of Service, Privacy Policy, Imprint)
 */
function setupLegalModals() {
    // Get all legal modals
    const termsModal = document.getElementById('termsModal');
    const privacyModal = document.getElementById('privacyModal');
    const imprintModal = document.getElementById('imprintModal');
    const academicIntegrityModal = document.getElementById('academicIntegrityModal');
    
    // Set up event listeners for terms modal
    setupLegalModal(termsModal, '[data-modal="terms"]');
    
    // Set up event listeners for privacy modal
    setupLegalModal(privacyModal, '[data-modal="privacy"]');
    
    // Set up event listeners for imprint modal
    setupLegalModal(imprintModal, '[data-modal="imprint"]');
    
    // Set up event listeners for academic integrity modal
    setupLegalModal(academicIntegrityModal, '[data-modal="integrity"]');
}

/**
 * Set up a legal modal with its triggers and close functionality
 * @param {HTMLElement} modal - The modal element
 * @param {string} triggerSelector - The selector for modal triggers
 */
function setupLegalModal(modal, triggerSelector) {
    if (!modal) return;
    
    const modalClose = modal.querySelector('.modal-close');
    
    // Add event listeners to modal triggers
    const triggers = document.querySelectorAll(triggerSelector);
    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
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
}

/**
 * Open a modal
 * @param {HTMLElement} modal - The modal element to open
 */
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
}

/**
 * Close a modal
 * @param {HTMLElement} modal - The modal element to close
 */
function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}