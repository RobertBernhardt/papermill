// Example Modal Module
// Handles the creation and management of example detail modals

import { getExampleById, getAllExamples, loadExampleContent } from './exampleContent.js';
import { markdownToHtml, formatMarkdownForModal } from './markdownUtils.js';

/**
 * Initialize the example modal functionality
 */
export function initExampleModal() {
    createExampleModal();
    setupExampleModalEventListeners();
}

/**
 * Create the example modal container and add it to the DOM
 */
function createExampleModal() {
    // Check if the modal already exists
    if (document.getElementById('exampleModal')) return;
    
    // Create modal container
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.id = 'exampleModal';
    
    // Create modal content
    modalOverlay.innerHTML = `
        <div class="modal-container example-modal-container">
            <div class="modal-header">
                <h2 id="example-modal-title">Example Paper</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="example-modal-content">
                    <div class="paper-meta-large">
                        <span id="example-modal-field" class="field">Field</span>
                        <span id="example-modal-type" class="type">Type</span>
                        <div class="quality-score large">
                            <span id="example-modal-score" class="score">0.0/10</span>
                            <div class="score-bar">
                                <div id="example-modal-score-fill" class="score-fill" style="width: 0%;"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="example-modal-section">
                        <h3>Abstract</h3>
                        <p id="example-modal-abstract"></p>
                    </div>
                    
                    <div class="example-modal-section paper-content-section">
                        <h3>Paper Preview</h3>
                        <div class="paper-preview">
                            <div id="example-modal-content" class="paper-preview-content">
                                <div class="loading-indicator">Loading content...</div>
                            </div>
                            <button class="cta-button preview-cta">Generate Similar Paper</button>
                        </div>
                    </div>
                    
                    <div class="modal-navigation">
                        <button id="prev-example" class="nav-button prev">
                            <span class="nav-arrow">←</span> Previous Example
                        </button>
                        <button id="next-example" class="nav-button next">
                            Next Example <span class="nav-arrow">→</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to the page
    document.body.appendChild(modalOverlay);
    
    // Add styles for content display
    addExampleModalStyles();
}

/**
 * Add styles specific to the example modal content
 */
function addExampleModalStyles() {
    // Check if styles already exist
    if (document.getElementById('example-modal-styles')) return;
    
    const styleElement = document.createElement('style');
    styleElement.id = 'example-modal-styles';
    styleElement.textContent = `
        .paper-preview-content {
            max-height: 400px;
            overflow-y: auto;
            background-color: #f9f9f9;
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            border: 1px solid var(--border);
            position: relative;
        }
        
        .paper-preview-content h1 {
            font-size: 1.6rem;
            margin-bottom: 1rem;
            color: var(--primary);
        }
        
        .paper-preview-content h2 {
            font-size: 1.4rem;
            margin: 1.5rem 0 1rem;
            color: var(--primary);
        }
        
        .paper-preview-content h3 {
            font-size: 1.2rem;
            margin: 1.2rem 0 0.8rem;
            color: var(--primary);
        }
        
        .paper-preview-content p {
            margin-bottom: 1rem;
            line-height: 1.6;
        }
        
        .paper-preview-content ul, 
        .paper-preview-content ol {
            margin-bottom: 1rem;
            padding-left: 1.5rem;
        }
        
        .paper-preview-content li {
            margin-bottom: 0.5rem;
        }
        
        .paper-preview-content blockquote {
            border-left: 3px solid var(--secondary);
            padding-left: 1rem;
            margin: 1rem 0;
            color: var(--light-text);
            font-style: italic;
        }
        
        .loading-indicator {
            text-align: center;
            padding: 2rem;
            color: var(--light-text);
            font-style: italic;
        }
        
        .paper-content-section {
            margin-top: 1.5rem;
        }
    `;
    
    document.head.appendChild(styleElement);
}

/**
 * Set up event listeners for the example modal
 */
function setupExampleModalEventListeners() {
    const modal = document.getElementById('exampleModal');
    if (!modal) return;
    
    const closeButton = modal.querySelector('.modal-close');
    const generateButton = modal.querySelector('.preview-cta');
    const prevButton = document.getElementById('prev-example');
    const nextButton = document.getElementById('next-example');
    
    // Close modal when clicking the close button
    closeButton.addEventListener('click', () => closeExampleModal());
    
    // Close modal when clicking outside the modal content
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeExampleModal();
        }
    });
    
    // Handle Generate Similar Paper button
    if (generateButton) {
        generateButton.addEventListener('click', () => {
            // Close this modal
            closeExampleModal();
            
            // Open the paper form modal (if it exists)
            const paperFormModal = document.getElementById('paperFormModal');
            if (paperFormModal) {
                paperFormModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }
    
    // Previous and Next buttons
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            const currentId = modal.getAttribute('data-example-id');
            const prevId = getPrevExampleId(currentId);
            if (prevId) {
                openExampleModal(prevId);
            }
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            const currentId = modal.getAttribute('data-example-id');
            const nextId = getNextExampleId(currentId);
            if (nextId) {
                openExampleModal(nextId);
            }
        });
    }
    
    // Close modal when pressing Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            closeExampleModal();
        }
    });
}

/**
 * Open the example modal with content for a specific example
 * @param {string} exampleId - The ID of the example to display
 */
export async function openExampleModal(exampleId) {
    const modal = document.getElementById('exampleModal');
    if (!modal) return;
    
    const example = getExampleById(exampleId);
    if (!example) return;
    
    // Set example ID on modal
    modal.setAttribute('data-example-id', exampleId);
    
    // Update modal content
    document.getElementById('example-modal-title').textContent = example.title;
    document.getElementById('example-modal-field').textContent = example.field;
    document.getElementById('example-modal-type').textContent = example.type;
    document.getElementById('example-modal-score').textContent = example.score.toFixed(1) + '/10';
    document.getElementById('example-modal-score-fill').style.width = (example.score * 10) + '%';
    document.getElementById('example-modal-abstract').textContent = example.abstract;
    
    // Update navigation buttons
    const prevButton = document.getElementById('prev-example');
    const nextButton = document.getElementById('next-example');
    
    const prevId = getPrevExampleId(exampleId);
    const nextId = getNextExampleId(exampleId);
    
    prevButton.disabled = !prevId;
    nextButton.disabled = !nextId;
    
    // Show the modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add animation class to modal container
    const modalContainer = modal.querySelector('.modal-container');
    if (modalContainer) {
        modalContainer.classList.add('modal-animate-in');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            modalContainer.classList.remove('modal-animate-in');
        }, 500);
    }
    
    // Show loading indicator
    const contentContainer = document.getElementById('example-modal-content');
    if (contentContainer) {
        contentContainer.innerHTML = '<div class="loading-indicator">Loading content...</div>';
    }
    
    // Load markdown content
    try {
        if (example.contentFilePath) {
            const markdownContent = await loadExampleContent(example.contentFilePath);
            const formattedMarkdown = formatMarkdownForModal(markdownContent);
            const htmlContent = markdownToHtml(formattedMarkdown);
            
            // Update content container
            if (contentContainer) {
                contentContainer.innerHTML = htmlContent;
            }
        } else {
            // Fallback to placeholder
            if (contentContainer) {
                contentContainer.innerHTML = '<p>No content available for this example.</p>';
            }
        }
    } catch (error) {
        console.error('Error loading content:', error);
        if (contentContainer) {
            contentContainer.innerHTML = '<p>Error loading content. Please try again later.</p>';
        }
    }
}

/**
 * Close the example modal
 */
function closeExampleModal() {
    const modal = document.getElementById('exampleModal');
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Get the ID of the previous example in the list
 * @param {string} currentId - The current example ID
 * @returns {string|null} The previous example ID or null if at the beginning
 */
function getPrevExampleId(currentId) {
    const examples = getAllExamples();
    const currentIndex = examples.findIndex(example => example.id === currentId);
    
    if (currentIndex > 0) {
        return examples[currentIndex - 1].id;
    }
    
    return null;
}

/**
 * Get the ID of the next example in the list
 * @param {string} currentId - The current example ID
 * @returns {string|null} The next example ID or null if at the end
 */
function getNextExampleId(currentId) {
    const examples = getAllExamples();
    const currentIndex = examples.findIndex(example => example.id === currentId);
    
    if (currentIndex < examples.length - 1) {
        return examples[currentIndex + 1].id;
    }
    
    return null;
}