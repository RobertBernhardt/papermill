// Contact Modal Module - Fixed Version
// Handles the contact form modal functionality

/**
 * Initialize the contact modal functionality
 */
export function initContactModal() {
    // Get the contact modal element
    const contactModal = document.getElementById('contactFormModal');
    if (!contactModal) {
        console.error('Contact form modal not found');
        return;
    }
    
    // Attach event listeners to contact links
    setupContactLinks(contactModal);
    
    // Set up modal close functionality
    setupModalClose(contactModal);
    
    // Set up response options
    setupResponseOptions(contactModal);
    
    // Set up form submission
    setupFormSubmission(contactModal);
}

/**
 * Set up event listeners for contact links
 * @param {HTMLElement} modal - The modal element
 */
function setupContactLinks(modal) {
    // Get all links that point to #contact
    const contactLinks = document.querySelectorAll('a[href="#contact"]');
    
    // Attach click handler to each link
    contactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            openModal(modal);
        });
    });
}

/**
 * Set up modal close functionality
 * @param {HTMLElement} modal - The modal element
 */
function setupModalClose(modal) {
    // Close button
    const closeButton = modal.querySelector('.modal-close');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            closeModal(modal);
        });
    }
    
    // Close when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal(modal);
        }
    });
}

/**
 * Open the modal
 * @param {HTMLElement} modal - The modal element
 */
function openModal(modal) {
    // Show the modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Reset the form
    const form = modal.querySelector('form');
    if (form) form.reset();
    
    // Select the first response option
    const options = modal.querySelectorAll('.response-preference .option');
    options.forEach((option, index) => {
        option.classList[index === 0 ? 'add' : 'remove']('selected');
    });
    
    // Focus the first field
    setTimeout(() => {
        const firstInput = modal.querySelector('input[type="text"]');
        if (firstInput) firstInput.focus();
    }, 300);
}

/**
 * Close the modal
 * @param {HTMLElement} modal - The modal element
 */
function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Set up response time options
 * @param {HTMLElement} modal - The modal element
 */
function setupResponseOptions(modal) {
    const options = modal.querySelectorAll('.response-preference .option');
    
    // Select first option by default
    if (options.length > 0) {
        options[0].classList.add('selected');
    }
    
    // Add click handlers
    options.forEach(option => {
        option.addEventListener('click', function() {
            // Deselect all options
            options.forEach(opt => opt.classList.remove('selected'));
            
            // Select clicked option
            this.classList.add('selected');
        });
    });
}

/**
 * Set up form submission
 * @param {HTMLElement} modal - The modal element
 */
function setupFormSubmission(modal) {
    const form = modal.querySelector('.contact-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate the sun verification
        const verification = document.getElementById('contact-verification');
        if (!verification) return;
        
        const answer = verification.value.toLowerCase().trim();
        if (!isValidSunAnswer(answer)) {
            // Show error
            verification.classList.add('error');
            verification.setAttribute('placeholder', 'Hint: It rhymes with "fun"');
            
            // Remove error after delay
            setTimeout(() => {
                verification.classList.remove('error');
                verification.setAttribute('placeholder', 'Hint: It\'s hot and gives you vitamin D');
            }, 3000);
            
            return;
        }
        
        // Handle submission UI
        const submitButton = form.querySelector('button[type="submit"]');
        if (!submitButton) return;
        
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate sending (would be an API call in production)
        setTimeout(() => {
            submitButton.textContent = 'Message Sent!';
            
            setTimeout(() => {
                closeModal(modal);
                
                // Reset button after closing
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 500);
            }, 1500);
        }, 2000);
    });
}

/**
 * Check if the sun verification answer is valid
 * @param {string} answer - The user's answer
 * @returns {boolean} Whether the answer is valid
 */
function isValidSunAnswer(answer) {
    const validAnswers = [
        'sun', 'the sun', 'sol', 'our sun', 
        'sonne', 'soleil', 'sole', 'solar'
    ];
    
    return validAnswers.includes(answer);
}