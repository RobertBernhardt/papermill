// Animations Utility Module
// Handles animations and visual effects throughout the site

/**
 * Apply fade-in animations to page elements
 */
export function fadeInElements() {
    applyAnimationDelays();
    handleScrollAnimations();
}

/**
 * Apply staggered animation delays to elements
 */
function applyAnimationDelays() {
    // Apply animation delays to elements for staggered effect
    const animatedElements = [
        '.cta-button', 
        '.section-intro', 
        '.step', 
        '.option-category', 
        '.example-paper', 
        '.testimonial', 
        '.faq-item'
    ];
    
    animatedElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            if (selector === '.section-intro') {
                el.style.animationDelay = '0.1s';
            } else if (selector === '.step') {
                if (index % 2 === 0) { // Only apply to actual steps, not connectors
                    el.style.animationDelay = `${0.2 + (index / 2) * 0.1}s`;
                }
            } else if (['.option-category', '.example-paper', '.testimonial'].includes(selector)) {
                el.style.animationDelay = `${0.2 + index * 0.1}s`;
            }
        });
    });
}

/**
 * Initialize scroll-triggered animations
 */
function handleScrollAnimations() {
    // Add smooth scroll behavior for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // For future implementation: scroll-triggered animation
    // This would observe elements and trigger animations when they enter viewport
}

/**
 * Create a pulse animation effect on an element
 * @param {HTMLElement} element - The element to animate
 * @param {string} className - The class to apply for animation
 * @param {number} duration - Duration in milliseconds
 */
export function pulseAnimation(element, className, duration = 500) {
    if (!element) return;
    
    element.classList.add(className);
    setTimeout(() => {
        element.classList.remove(className);
    }, duration);
}