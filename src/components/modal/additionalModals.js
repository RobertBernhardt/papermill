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
 * Create a fill-in-the-blank style contact form
 * @returns {HTMLElement} The created form element
 */
function createFillInTheBlankContactForm() {
    // Create the form element
    const form = document.createElement('form');
    form.className = 'contact-form fill-in-the-blank-form';
    
    // Create the form content with blanks for user input
    form.innerHTML = `
        <div class="narrative-container">
            <p class="narrative-text">
                Dear Paper Mill Wizards,<br><br>
                
                My name is <span class="blank-container">
                    <input type="text" id="contact-name" placeholder="your distinguished name" required>
                </span> 
                and you can reach me at <span class="blank-container">
                    <input type="email" id="contact-email" placeholder="your secret email" required>
                </span>.<br><br>
                
                I am writing to you because <span class="blank-container subject-container">
                    <select id="contact-subject" required>
                        <option value="" disabled selected>select your predicament</option>
                        <option value="existential">I'm having an existential crisis about my paper deadline</option>
                        <option value="technical">your magical system seems to be malfunctioning</option>
                        <option value="quality">I need to discuss the brilliance (or lack thereof) of my paper</option>
                        <option value="business">I want to propose a business deal that will make us both rich</option>
                        <option value="praise">I simply need to praise your genius publicly</option>
                        <option value="complaint">I must register a formal complaint (with utmost politeness)</option>
                        <option value="question">I have a burning question keeping me up at night</option>
                        <option value="other">something completely different is happening</option>
                    </select>
                </span>.<br><br>
                
                Here are the details of my situation:<br>
                <span class="blank-container message-container">
                    <textarea id="contact-message" rows="4" placeholder="your deeply fascinating message..." required></textarea>
                </span><br><br>
                
                I expect your response to be <span class="blank-container">
                    <select id="response-time">
                        <option value="urgent">lightning-fast (I'm literally refreshing my inbox)</option>
                        <option value="normal" selected>reasonably timely</option>
                        <option value="whenever">whenever (I've mastered the art of patience)</option>
                    </select>
                </span> and would rate my current stress level as <span class="blank-container">
                    <select id="stress-level">
                        <option value="low">perfectly calm (unusual for a student)</option>
                        <option value="medium" selected>mildly concerning</option>
                        <option value="high">approaching cosmic meltdown</option>
                        <option value="extreme">beyond the measurement capabilities of modern science</option>
                    </select>
                </span>.<br><br>
                
                Academically yours,<br>
                <span class="signature-name">Your name will appear here magically</span>
            </p>
        </div>
        
        <button type="submit" class="cta-button primary full-width">Send This Masterpiece</button>
        
        <p class="form-disclaimer">We'll respond to your inquiry within 24-48 hours, regardless of how desperate you sound. Your information will be processed in accordance with our <a href="#privacy" data-modal="privacy">Privacy Policy</a>.</p>
    `;
    
    // Add event listeners for dynamic aspects
    const nameInput = form.querySelector('#contact-name');
    nameInput.addEventListener('input', function() {
        const signatureName = this.value.trim() || 'Your name will appear here magically';
        form.querySelector('.signature-name').textContent = signatureName;
    });
    
    return form;
}

/**
 * Set up the contact modal
 */
function setupContactModal() {
    // Get the contact modal
    const contactModal = document.getElementById('contactModal');
    if (!contactModal) return;
    
    const modalBody = contactModal.querySelector('.modal-body');
    const modalClose = contactModal.querySelector('.modal-close');
    
    // Replace the existing form with our new fill-in-the-blank form
    const existingForm = modalBody.querySelector('form');
    if (existingForm) {
        modalBody.removeChild(existingForm);
    }
    
    const newForm = createFillInTheBlankContactForm();
    modalBody.appendChild(newForm);
    
    // Add event listeners to contact modal triggers
    const contactTriggers = document.querySelectorAll('[data-modal="contact"]');
    contactTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(contactModal);
            
            // Focus on the first input after a short delay (for animation to complete)
            setTimeout(() => {
                const firstInput = newForm.querySelector('#contact-name');
                if (firstInput) firstInput.focus();
            }, 400);
        });
    });
    
    // Close modal when clicking the close button
    modalClose.addEventListener('click', () => closeModal(contactModal));
    
    // Close modal when clicking outside the modal content
    contactModal.addEventListener('click', function(event) {
        if (event.target === contactModal) {
            closeModal(contactModal);
        }
    });
    
    // Handle form submission
    newForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Simulate form submission
        const submitButton = newForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Sending Your Masterpiece...';
        submitButton.disabled = true;
        
        // Simulate API call with timeout
        setTimeout(() => {
            // Here you would normally send data to server
            console.log('Contact form submitted');
            
            // Reset button
            submitButton.textContent = 'Masterpiece Delivered!';
            
            // Close modal after delay
            setTimeout(() => {
                closeModal(contactModal);
                // Reset button text after modal is closed
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    newForm.reset();
                    // Reset the signature line
                    newForm.querySelector('.signature-name').textContent = 'Your name will appear here magically';
                }, 500);
            }, 1500);
        }, 1500);
    });
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