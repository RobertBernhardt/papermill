// Cookie Notice Module
// Handles the cookie consent banner functionality

/**
 * Initialize the cookie notice functionality
 */
export function initCookieNotice() {
    createCookieNotice();
    setupCookieEventListeners();
}

/**
 * Create and inject the cookie notice HTML
 */
function createCookieNotice() {
    // Check if the notice already exists
    if (document.getElementById('cookieNotice')) return;
    
    // Create the cookie notice element
    const cookieNotice = document.createElement('div');
    cookieNotice.className = 'cookie-notice';
    cookieNotice.id = 'cookieNotice';
    
    // Set the inner HTML
    cookieNotice.innerHTML = `
        <div class="cookie-content">
            <p>"Experience is simply the name browsers give to their cookies."</p>
            <p class="cookie-subtext">Our legal team insists we display this ridiculous banner even though we both know you'll click 'Accept' without reading our <a href="#privacy" data-modal="privacy">Privacy Policy</a>.</p>
        </div>
        <div class="cookie-actions">
            <button class="cookie-button accept" id="acceptCookies">Accept Inevitability</button>
            <button class="cookie-button decline" id="declineCookies">Feign Resistance</button>
        </div>
        <button class="cookie-close" id="closeCookieNotice" aria-label="Close cookie notice">&times;</button>
    `;
    
    // Initially hide the notice
    cookieNotice.classList.add('hidden');
    
    // Add to the document
    document.body.appendChild(cookieNotice);
    
    // Check if the user already made a choice
    const cookieChoiceMade = localStorage.getItem('paperMillCookieChoice');
    
    if (!cookieChoiceMade) {
        // Show the notice with a slight delay for better UX
        setTimeout(() => {
            cookieNotice.classList.remove('hidden');
        }, 1500);
    }
}

/**
 * Set up the event listeners for the cookie notice
 */
function setupCookieEventListeners() {
    const cookieNotice = document.getElementById('cookieNotice');
    if (!cookieNotice) return;
    
    // Set up event listeners for buttons
    const acceptButton = document.getElementById('acceptCookies');
    const declineButton = document.getElementById('declineCookies');
    const closeButton = document.getElementById('closeCookieNotice');
    
    if (acceptButton) {
        acceptButton.addEventListener('click', () => {
            localStorage.setItem('paperMillCookieChoice', 'accepted');
            hideCookieNotice();
            // In a real implementation, you would set cookies here
        });
    }
    
    if (declineButton) {
        declineButton.addEventListener('click', () => {
            localStorage.setItem('paperMillCookieChoice', 'declined');
            hideCookieNotice();
            // In a real implementation, you would avoid setting non-essential cookies
        });
    }
    
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            localStorage.setItem('paperMillCookieChoice', 'closed');
            hideCookieNotice();
        });
    }
    
    // Make sure the privacy policy link works
    const privacyLink = cookieNotice.querySelector('a[data-modal="privacy"]');
    if (privacyLink) {
        privacyLink.addEventListener('click', (e) => {
            e.preventDefault();
            const privacyModal = document.getElementById('privacyModal');
            if (privacyModal) {
                privacyModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }
}

/**
 * Hide the cookie notice
 */
function hideCookieNotice() {
    const cookieNotice = document.getElementById('cookieNotice');
    if (cookieNotice) {
        cookieNotice.classList.add('hidden');
    }
}