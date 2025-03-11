// Contact Modal Module
// Handles the contact form modal functionality

/**
 * Initialize the contact modal functionality
 */
export function initContactModal() {
    const modal = document.getElementById('contactFormModal');
    const modalClose = modal.querySelector('.modal-close');
    const contactForm = modal.querySelector('.contact-form');
    
    // Add event listeners to all contact links
    const contactLinks = document.querySelectorAll('a[href="#contact"]');
    contactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
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
    
    // Set up the response time options
    setupResponseOptions(modal);
    
    // Handle form submission
    setupFormSubmission(contactForm, modal);
}

/**
 * Open the contact modal
 * @param {HTMLElement} modal - The modal element
 */
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
    
    // Reset form
    const contactForm = modal.querySelector('.contact-form');
    contactForm.reset();
    
    // Reset response options
    document.querySelectorAll('.response-preference .option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelector('.response-preference .option:first-child').classList.add('selected');
    
    // Focus on first input
    setTimeout(() => {
        const firstInput = modal.querySelector('input[type="text"]');
        if (firstInput) firstInput.focus();
    }, 400);
}

/**
 * Close the modal
 * @param {HTMLElement} modal - The modal element
 */
function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

/**
 * Set up the response time options
 * @param {HTMLElement} modal - The modal element
 */
function setupResponseOptions(modal) {
    const responseOptions = modal.querySelectorAll('.response-preference .option');
    
    responseOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Deselect all options
            responseOptions.forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Select clicked option
            this.classList.add('selected');
        });
    });
}

/**
 * Validate the "closest star" verification question
 * @param {string} answer - The user's answer
 * @returns {boolean} Whether the answer is correct
 */
function validateStarQuestion(answer) {
    if (!answer) return false;
    
    // Convert to lowercase and trim for more flexible validation
    const normalizedAnswer = answer.toLowerCase().trim();
    
    // Accept various forms of the answer
    const validAnswers = [
        'sun', 'the sun', 'sol', 'the sol', 'our sun',
        'солнце', 'sole', 'sonne', 'soleil', 'sol',
        '太陽', '太阳', '태양', 'الشمس', 'ήλιος'
    ];
    
    return validAnswers.includes(normalizedAnswer);
}

/**
 * Set up the form submission handling
 * @param {HTMLElement} contactForm - The contact form element
 * @param {HTMLElement} modal - The modal element
 */
function setupFormSubmission(contactForm, modal) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form values
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const reason = document.getElementById('contact-reason').value;
        const message = document.getElementById('contact-message').value;
        const verification = document.getElementById('contact-verification').value;
        
        // Validate the star question
        if (!validateStarQuestion(verification)) {
            // Highlight the verification field with an error
            const verificationInput = document.getElementById('contact-verification');
            verificationInput.classList.add('error');
            verificationInput.setAttribute('placeholder', 'Hint: It rhymes with "fun"');
            
            // Remove error class after 3 seconds
            setTimeout(() => {
                verificationInput.classList.remove('error');
                verificationInput.setAttribute('placeholder', 'Hint: It\'s hot and gives you vitamin D');
            }, 3000);
            
            return;
        }
        
        // Get selected response option
        const selectedOption = document.querySelector('.response-preference .option.selected');
        const responseSpeed = selectedOption ? selectedOption.querySelector('.option-name').textContent : 'Eventually';
        
        // Simulate form submission
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate API call with timeout
        setTimeout(() => {
            // Here you would normally send data to server
            console.log('Contact form submitted:', {
                name,
                email,
                reason,
                message,
                responseSpeed
            });
            
            // Reset button
            submitButton.textContent = 'Message Sent!';
            
            // Close modal after delay
            setTimeout(() => {
                closeModal(modal);
                // Reset button text after modal is closed
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 500);
            }, 1500);
        }, 2000);
    });
}