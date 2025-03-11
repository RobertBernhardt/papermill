// Header Module
// Handles the site header functionality and mobile menu toggle

/**
 * Initialize the header component
 */
export function initHeader() {
    setupMobileMenu();
    setupLogoHomeLink();
    setupCTAButton();
    setupNavAnimations();
}

/**
 * Set up the mobile menu toggle functionality
 */
function setupMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (!menuToggle || !mainNav) return;
    
    menuToggle.addEventListener('click', function() {
        // Toggle active class on the menu
        mainNav.classList.toggle('active');
        menuToggle.classList.toggle('active');
        
        // Update ARIA attributes for accessibility
        const isExpanded = mainNav.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
        
        // Toggle body scroll when menu is open on mobile
        if (isExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (
            mainNav.classList.contains('active') && 
            !mainNav.contains(event.target) && 
            !menuToggle.contains(event.target)
        ) {
            mainNav.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', false);
            document.body.style.overflow = '';
        }
    });
}

/**
 * Set up subtle animations for the navigation items
 */
function setupNavAnimations() {
    const navItems = document.querySelectorAll('.main-nav a');
    
    // Add subtle entrance animation on load
    navItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });
    
    // Add hover effect for icons
    navItems.forEach(item => {
        const icon = item.querySelector('svg');
        if (icon) {
            item.addEventListener('mouseover', () => {
                icon.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
                icon.style.transform = 'scale(1.2) rotate(5deg)';
            });
            
            item.addEventListener('mouseout', () => {
                icon.style.transform = 'scale(1) rotate(0deg)';
            });
        }
    });
}

/**
 * Set up the logo home link behavior
 */
function setupLogoHomeLink() {
    const logoLink = document.querySelector('.logo a');
    
    if (!logoLink) return;
    
    logoLink.addEventListener('click', function(event) {
        // If we're already on the home page, prevent default and scroll to top
        if (window.location.pathname === '/' || window.location.pathname === '/index.html' || window.location.pathname === '') {
            event.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
}

/**
 * Set up the CTA button behavior
 */
function setupCTAButton() {
    const headerCTAButton = document.querySelector('.header-cta .cta-button');
    
    if (!headerCTAButton) return;
    
    headerCTAButton.addEventListener('click', function() {
        const paperFormModal = document.getElementById('paperFormModal');
        if (paperFormModal) {
            paperFormModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
}