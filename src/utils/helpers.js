// Helpers Utility Module
// Common helper functions used throughout the application

/**
 * Format currency value
 * @param {number} value - The value to format
 * @param {string} currency - The currency symbol
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted currency string
 */
export function formatCurrency(value, currency = '$', decimals = 2) {
    return `${currency}${value.toFixed(decimals)}`;
}

/**
 * Debounce function to prevent function from being called too frequently
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 100) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
}

/**
 * Create a DOM element with attributes and children
 * @param {string} tag - The HTML tag name
 * @param {Object} attributes - Element attributes
 * @param {Array|string|HTMLElement} children - Child elements or text content
 * @returns {HTMLElement} The created element
 */
export function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'style' && typeof value === 'object') {
            Object.assign(element.style, value);
        } else {
            element.setAttribute(key, value);
        }
    });
    
    // Add children
    if (Array.isArray(children)) {
        children.forEach(child => {
            if (child instanceof HTMLElement) {
                element.appendChild(child);
            } else {
                element.appendChild(document.createTextNode(child));
            }
        });
    } else if (children instanceof HTMLElement) {
        element.appendChild(children);
    } else if (children) {
        element.textContent = children;
    }
    
    return element;
}

/**
 * Get URL query parameters as an object
 * @returns {Object} Query parameters as key-value pairs
 */
export function getQueryParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    
    if (!queryString) return params;
    
    queryString.split('&').forEach(pair => {
        const [key, value] = pair.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    });
    
    return params;
}

/**
 * Validate email address format
 * @param {string} email - The email address to validate
 * @returns {boolean} Whether the email is valid
 */
export function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}