// Pricing Module
// Handles the pricing selection and calculation functionality

/**
 * Selected pricing options state
 */
export let selectedPricingOptions = {
    paperScope: 'Seminar Paper',
    paperScopePrice: 0,
    creativityLevel: 'Basic',
    creativityLevelPrice: 0,
    qualityControl: 'Basic',
    qualityControlPrice: 0
};

/**
 * Initialize the pricing functionality
 */
export function initPricing() {
    setupPricingOptions();
}

/**
 * Set up the pricing options and event listeners
 */
function setupPricingOptions() {
    // Handle total price calculation on pricing page
    const priceOptions = document.querySelectorAll('.option');
    const totalPrice = document.querySelector('.total-price .price');
    
    if (priceOptions.length > 0 && totalPrice) {
        priceOptions.forEach(option => {
            // Get the category and option name for data tracking
            const category = option.closest('.option-category');
            const categoryName = category.querySelector('h3').textContent.trim();
            const optionName = option.querySelector('.option-name').textContent.trim();
            
            // Add data attributes for easier selection
            option.setAttribute('data-category', categoryName);
            option.setAttribute('data-name', optionName);
            
            option.addEventListener('click', function() {
                const categoryOptions = category.querySelectorAll('.option');
                
                // Deselect other options in this category
                categoryOptions.forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Select this option
                this.classList.add('selected');
                
                // Update our tracking object
                updateSelectedOption(categoryName, optionName, parseInt(this.dataset.price || 0));
                
                // Calculate and update total price
                updateTotalPrice(totalPrice);
            });
        });
    }
}

/**
 * Update the selected option in the state
 * @param {string} categoryName - The category name
 * @param {string} optionName - The option name
 * @param {number} price - The option price
 */
function updateSelectedOption(categoryName, optionName, price) {
    if (categoryName === 'Paper Scope') {
        selectedPricingOptions.paperScope = optionName;
        selectedPricingOptions.paperScopePrice = price;
    } else if (categoryName === 'Creativity Level') {
        selectedPricingOptions.creativityLevel = optionName;
        selectedPricingOptions.creativityLevelPrice = price;
    } else if (categoryName === 'Quality Control') {
        selectedPricingOptions.qualityControl = optionName;
        selectedPricingOptions.qualityControlPrice = price;
    }
}

/**
 * Calculate and update the total price display
 * @param {HTMLElement} totalPriceElement - The element to update with the total price
 */
function updateTotalPrice(totalPriceElement) {
    // Calculate new total
    let total = 5; // Base price
    document.querySelectorAll('.option.selected').forEach(selectedOption => {
        total += parseInt(selectedOption.dataset.price || 0);
    });
    
    // Update total display with animation
    totalPriceElement.textContent = '$' + total;
    totalPriceElement.classList.add('price-updated');
    setTimeout(() => {
        totalPriceElement.classList.remove('price-updated');
    }, 500);
}

/**
 * Get the current selected pricing options
 * @returns {Object} The selected pricing options
 */
export function getSelectedPricingOptions() {
    return { ...selectedPricingOptions };
}

/**
 * Reset pricing options to defaults
 */
export function resetPricingOptions() {
    selectedPricingOptions = {
        paperScope: 'Seminar Paper',
        paperScopePrice: 0,
        creativityLevel: 'Basic',
        creativityLevelPrice: 0,
        qualityControl: 'Basic',
        qualityControlPrice: 0
    };
}