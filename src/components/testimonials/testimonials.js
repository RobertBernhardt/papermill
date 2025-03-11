// Testimonials Module
// Handles testimonial display and functionality

/**
 * Initialize the testimonials component
 */
export function initTestimonials() {
    // For future functionality like rotation, filtering, or adding more testimonials
    setupTestimonials();
}

/**
 * Set up testimonials with any needed enhancements
 */
function setupTestimonials() {
    // This is a placeholder for future functionality
    // In a more complex implementation, we could add:
    // - Testimonial rotation/carousel
    // - Loading more testimonials via AJAX
    // - Filtering testimonials by category
    // - "Add your own testimonial" form
    
    const testimonialCards = document.querySelector('.testimonial-cards');
    if (!testimonialCards) return;
    
    // Example of adding hover effect to testimonials
    const testimonials = testimonialCards.querySelectorAll('.testimonial');
    testimonials.forEach(testimonial => {
        testimonial.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
            this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.08)';
        });
        
        testimonial.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.05)';
        });
    });
}

/**
 * Add a new testimonial (for future implementation)
 * @param {Object} testimonialData - The testimonial data object
 * @param {string} testimonialData.quote - The testimonial quote
 * @param {string} testimonialData.author - The testimonial author
 */
export function addTestimonial(testimonialData) {
    const testimonialCards = document.querySelector('.testimonial-cards');
    if (!testimonialCards) return;
    
    const testimonial = document.createElement('div');
    testimonial.className = 'testimonial';
    
    testimonial.innerHTML = `
        <p class="quote">"${testimonialData.quote}"</p>
        <p class="author">- ${testimonialData.author}</p>
    `;
    
    // Add hover effects
    testimonial.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.transition = 'transform 0.3s ease';
        this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.08)';
    });
    
    testimonial.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.05)';
    });
    
    // Fade in animation
    testimonial.style.opacity = '0';
    testimonialCards.appendChild(testimonial);
    
    // Trigger reflow to ensure animation works
    void testimonial.offsetWidth;
    
    testimonial.style.transition = 'opacity 0.5s ease';
    testimonial.style.opacity = '1';
}