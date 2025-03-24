// Examples Module
// Handles the examples section functionality

import { getAllExamples } from './exampleContent.js';
import { openExampleModal } from './exampleModal.js';

/**
 * Initialize the examples functionality
 */
export function initExamples() {
    loadInitialExamples();
    setupViewMoreButton();
}

/**
 * Load the initial examples
 */
function loadInitialExamples() {
    // Get container for examples
    const examplesGrid = document.querySelector('.example-papers-grid');
    if (!examplesGrid) {
        console.error("Example papers grid not found");
        return;
    }
    
    // Clear any existing content
    examplesGrid.innerHTML = '';
    
    // Get all examples
    const allExamples = getAllExamples();
    
    // Load the first 3 examples - or all if there are fewer than 3
    const initialCount = Math.min(3, allExamples.length);
    const initialExamples = allExamples.slice(0, initialCount);
    
    // Create and append examples
    initialExamples.forEach((example, index) => {
        // Create example element
        const exampleElement = createExampleElement(example);
        
        // Add animation delay based on position
        exampleElement.style.animationDelay = `${0.1 + (index * 0.1)}s`;
        
        // Append to container
        examplesGrid.appendChild(exampleElement);
        
        // Add click handler
        exampleElement.addEventListener('click', function() {
            openExampleModal(this.getAttribute('data-example-id'));
        });
    });
}

/**
 * Set up click handler for "View More Examples" button
 */
function setupViewMoreButton() {
    const viewMoreLink = document.querySelector('.examples-cta .cta-link');
    
    if (viewMoreLink) {
        viewMoreLink.addEventListener('click', function(e) {
            e.preventDefault();
            loadMoreExamples();
        });
    }
}

/**
 * Load additional examples when "View More Examples" is clicked
 */
function loadMoreExamples() {
    // Get container for examples
    const examplesGrid = document.querySelector('.example-papers-grid');
    if (!examplesGrid) return;
    
    // Get all examples
    const allExamples = getAllExamples();
    
    // Skip the examples already shown (assuming 3 initial examples)
    const initialCount = Math.min(3, allExamples.length);
    const additionalExamples = allExamples.slice(initialCount);
    
    if (additionalExamples.length === 0) {
        console.log("No additional examples to load");
        return;
    }
    
    // Create and append new examples
    additionalExamples.forEach((example, index) => {
        // Create example element
        const exampleElement = createExampleElement(example);
        
        // Add animation
        exampleElement.style.opacity = '0';
        exampleElement.style.transform = 'translateY(20px)';
        
        // Append to container
        examplesGrid.appendChild(exampleElement);
        
        // Trigger animation with slight delay for each example
        setTimeout(() => {
            exampleElement.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            exampleElement.style.opacity = '1';
            exampleElement.style.transform = 'translateY(0)';
            
            // Add click handler
            exampleElement.addEventListener('click', function() {
                openExampleModal(this.getAttribute('data-example-id'));
            });
        }, 100 + (index * 150));
    });
    
    // Update or hide the "View More" button since all examples are now shown
    updateViewMoreButton();
}

/**
 * Create an example element from example data
 * @param {Object} example - The example data object
 * @returns {HTMLElement} The created example element
 */
function createExampleElement(example) {
    const exampleElement = document.createElement('div');
    exampleElement.className = 'example-paper';
    exampleElement.setAttribute('data-example-id', example.id);
    
    // Prepare excerpt text - use the provided excerpt or take the first 150 chars of the abstract
    const excerptText = example.excerpt || example.abstract.substring(0, 150) + '...';
    
    // Create HTML structure for example card
    exampleElement.innerHTML = `
        <h3>${example.title}</h3>
        <div class="paper-meta">
            <span class="field">${example.field}</span>
            <span class="type">${example.type}</span>
            ${example.mark ? `<span class="mark">${example.mark}</span>` : ''}
        </div>
        <div class="paper-excerpt">
            <p>${excerptText}</p>
        </div>
        <div class="quality-score">
            <span class="score">${example.score.toFixed(1)}/10</span>
            <div class="score-bar">
                <div class="score-fill" style="width: ${example.score * 10}%;"></div>
            </div>
        </div>
    `;
    
    return exampleElement;
}

/**
 * Update or hide the "View More Examples" button after loading all examples
 */
function updateViewMoreButton() {
    const viewMoreLink = document.querySelector('.examples-cta .cta-link');
    const examplesCta = document.querySelector('.examples-cta');
    
    if (viewMoreLink && examplesCta) {
        // Replace with a "Generate Your Own" button
        const generateButton = document.createElement('button');
        generateButton.className = 'cta-button primary';
        generateButton.textContent = 'Generate Your Own Paper';
        
        // Add click handler to open paper form modal
        generateButton.addEventListener('click', function() {
            const paperFormModal = document.getElementById('paperFormModal');
            if (paperFormModal) {
                paperFormModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
        
        // Animate the transition
        viewMoreLink.style.opacity = '0';
        
        setTimeout(() => {
            // Replace the link with the button
            examplesCta.innerHTML = '';
            examplesCta.appendChild(generateButton);
            
            // Animate the new button
            generateButton.style.opacity = '0';
            generateButton.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                generateButton.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                generateButton.style.opacity = '1';
                generateButton.style.transform = 'scale(1)';
            }, 50);
        }, 300);
    }
}