// Example Modal Module
// Handles the creation and management of example detail modals
// With lazy loading PDF support

import { getExampleById, getAllExamples } from './exampleContent.js';
import { markdownToHtml } from './markdownUtils.js';

// Track loaded PDFs to avoid reloading
const loadedPdfs = {};

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
                        <span id="example-modal-mark" class="mark"></span>
                    </div>
                    
                    <div class="example-modal-section">
                        <h3>Abstract</h3>
                        <div id="example-modal-abstract"></div>
                    </div>
                    
                    <div class="example-modal-section paper-content-section">
                        <h3>Paper Preview</h3>
                        <div class="paper-preview">
                            <div id="example-modal-content" class="paper-preview-content">
                                <div class="pdf-placeholder">
                                    <p>Paper preview will load on demand.</p>
                                </div>
                            </div>
                            <div class="pdf-controls">
                                <button id="load-pdf-button" class="cta-button secondary">Load PDF Preview</button>
                                <a id="download-pdf-link" class="cta-link" target="_blank">Download Full PDF</a>
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
    
    // Add listener for PDF load button - dynamically added each time modal is opened
    modal.addEventListener('click', function(event) {
        if (event.target.id === 'load-pdf-button') {
            const exampleId = modal.getAttribute('data-example-id');
            loadPdfContent(exampleId);
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
export function openExampleModal(exampleId) {
    console.log(`Opening example modal for: ${exampleId}`);
    const modal = document.getElementById('exampleModal');
    if (!modal) {
        console.error('Example modal not found in DOM');
        return;
    }
    
    const example = getExampleById(exampleId);
    if (!example) {
        console.error(`Example with ID ${exampleId} not found`);
        return;
    }
    
    // Set example ID on modal
    modal.setAttribute('data-example-id', exampleId);
    
    // Update modal content
    document.getElementById('example-modal-title').textContent = example.title;
    document.getElementById('example-modal-field').textContent = example.field;
    document.getElementById('example-modal-type').textContent = example.type;
    document.getElementById('example-modal-score').textContent = example.score.toFixed(1) + '/10';
    document.getElementById('example-modal-score-fill').style.width = (example.score * 10) + '%';
    
    // Display mark if available
    const markElement = document.getElementById('example-modal-mark');
    if (markElement) {
        if (example.mark) {
            markElement.textContent = example.mark;
            markElement.style.display = 'inline-block';
        } else {
            markElement.style.display = 'none';
        }
    }
    
    // Process the abstract - convert line breaks to proper HTML
    const abstractElement = document.getElementById('example-modal-abstract');
    if (abstractElement && example.abstract) {
        // Use markdown conversion for the abstract to handle line breaks properly
        const processedAbstract = example.abstract
            .replace(/\\-/g, '-') // Fix escaped hyphens
            .replace(/\\'/g, "'"); // Fix escaped apostrophes
        abstractElement.innerHTML = markdownToHtml(processedAbstract);
    }
    
    // Prepare the PDF content area with placeholder - PDF will load on button click
    const contentContainer = document.getElementById('example-modal-content');
    if (contentContainer) {
        const fileSize = example.fileSize || 'Unknown size';
        
        // Check if we've already loaded this PDF
        if (loadedPdfs[exampleId]) {
            contentContainer.innerHTML = loadedPdfs[exampleId];
        } else {
            // Show placeholder with load button
            contentContainer.innerHTML = `
                <div class="pdf-placeholder">
                    <div class="pdf-info">
                        <div class="pdf-icon">
                            <svg viewBox="0 0 24 24" width="48" height="48">
                                <path fill="#e74c3c" d="M14,2H6C4.9,2,4,2.9,4,4v16c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V8L14,2z M16,18H8v-2h8V18z M16,14H8v-2h8V14z M13,9V3.5L18.5,9H13z"/>
                            </svg>
                        </div>
                        <div class="pdf-details">
                            <p class="pdf-title">${example.title}</p>
                            <p class="pdf-size">PDF Preview Available (${fileSize})</p>
                            <p class="pdf-note">Click "Load PDF Preview" to view the document</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    // Update the download link
    const downloadLink = document.getElementById('download-pdf-link');
    if (downloadLink && example.pdfPath) {
        downloadLink.setAttribute('href', example.pdfPath);
        downloadLink.textContent = `Download Full PDF (${example.fileSize || 'Unknown size'})`;
    }
    
    // Update the load button
    const loadButton = document.getElementById('load-pdf-button');
    if (loadButton) {
        // Disable button if PDF already loaded
        if (loadedPdfs[exampleId]) {
            loadButton.textContent = 'PDF Loaded';
            loadButton.disabled = true;
        } else {
            loadButton.textContent = 'Load PDF Preview';
            loadButton.disabled = false;
        }
    }
    
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
}

/**
 * Load the PDF content for a specific example
 * @param {string} exampleId - The ID of the example to load PDF for
 */
function loadPdfContent(exampleId) {
    console.log(`Loading PDF for example: ${exampleId}`);
    const example = getExampleById(exampleId);
    if (!example || !example.pdfPath) {
        console.error(`No PDF path found for example ${exampleId}`);
        return;
    }
    
    const contentContainer = document.getElementById('example-modal-content');
    if (!contentContainer) return;
    
    // Show loading indicator
    contentContainer.innerHTML = `
        <div class="pdf-loading">
            <div class="loading-spinner"></div>
            <p>Loading PDF preview...</p>
        </div>
    `;
    
    // Create iframe for PDF and listen for load events
    const pdfContent = `
        <div class="pdf-container">
            <iframe 
                src="${example.pdfPath}"
                width="100%" 
                height="500" 
                class="pdf-viewer"
                title="${example.title}"
                allowfullscreen>
                <p>Your browser doesn't support embedded PDFs. <a href="${example.pdfPath}" target="_blank">Download the PDF</a> instead.</p>
            </iframe>
        </div>
    `;
    
    // Cache the loaded PDF content
    loadedPdfs[exampleId] = pdfContent;
    
    // Short delay to show loading indicator before displaying PDF
    setTimeout(() => {
        contentContainer.innerHTML = pdfContent;
        
        // Update the load button
        const loadButton = document.getElementById('load-pdf-button');
        if (loadButton) {
            loadButton.textContent = 'PDF Loaded';
            loadButton.disabled = true;
        }
        
        // Add event listener to detect if PDF failed to load
        const iframe = contentContainer.querySelector('iframe');
        if (iframe) {
            iframe.addEventListener('error', () => {
                contentContainer.innerHTML = `
                    <div class="pdf-error">
                        <p>Failed to load PDF preview. Please try downloading the PDF instead.</p>
                    </div>
                `;
            });
        }
    }, 800); // Short delay for better UX
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