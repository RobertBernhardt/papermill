// Markdown Utilities
// Functions for handling markdown conversion and formatting

/**
 * Convert markdown text to HTML
 * @param {string} markdown - The markdown text to convert
 * @returns {string} The converted HTML
 */
export function markdownToHtml(markdown) {
    if (!markdown) return '';
    
    // Process headings (# Heading) - h1 to h6
    markdown = markdown.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, text) => {
        const level = hashes.length;
        return `<h${level}>${text.trim()}</h${level}>`;
    });
    
    // Process bold text (**text**)
    markdown = markdown.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Process italic text (*text*)
    markdown = markdown.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Process code blocks (```code```)
    markdown = markdown.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>');
    
    // Process inline code (`code`)
    markdown = markdown.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Process links [text](url)
    markdown = markdown.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    
    // Process lists
    // Unordered lists
    markdown = markdown.replace(/^\s*[-*+]\s+(.+)$/gm, '<li>$1</li>');
    markdown = markdown.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // Ordered lists
    markdown = markdown.replace(/^\s*(\d+)\.\s+(.+)$/gm, '<li>$2</li>');
    markdown = markdown.replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');
    
    // Process paragraphs (empty line between paragraphs)
    // First, replace single newlines with spaces
    markdown = markdown.replace(/(?<!\n)\n(?!\n)/g, ' ');
    
    // Then handle double newlines as paragraph breaks
    markdown = markdown.replace(/\n\n/g, '</p><p>');
    
    // Wrap everything in paragraphs if it's not already
    // But avoid wrapping things that are already HTML tags
    const hasHtmlTag = /^<([a-z][a-z0-9]*)\b[^>]*>/i.test(markdown.trim());
    if (!hasHtmlTag) {
        markdown = `<p>${markdown}</p>`;
    }
    
    // Fix nested paragraph tags
    markdown = markdown.replace(/<p><(h[1-6]|ul|ol|pre|blockquote)/g, '<$1');
    markdown = markdown.replace(/(<\/(h[1-6]|ul|ol|pre|blockquote)>)<\/p>/g, '$1');
    
    // Process blockquotes
    markdown = markdown.replace(/^\s*>\s+(.+)$/gm, '<blockquote>$1</blockquote>');
    
    // Process horizontal rules (---)
    markdown = markdown.replace(/^---$/gm, '<hr>');
    
    return markdown;
}

/**
 * Extract the first section from a markdown document
 * @param {string} markdown - The markdown text
 * @param {number} headingLevel - The heading level to look for (default: 1)
 * @returns {string} The extracted introduction section
 */
export function extractIntroduction(markdown) {
    if (!markdown) return '';
    
    // Look for the first heading after the title
    const introRegex = /^#\s+.*\n\n((?:(?!^#\s+).+\n*)*)(?:^#\s+|$)/m;
    const match = introRegex.exec(markdown);
    
    if (match && match[1]) {
        return match[1].trim();
    }
    
    // If no introduction section found, return the first 500 characters
    return markdown.slice(0, 500) + '...';
}

/**
 * Remove references section from markdown
 * @param {string} markdown - The markdown text to process
 * @returns {string} Markdown without references
 */
export function removeReferences(markdown) {
    if (!markdown) return '';
    
    // Look for the references section and remove it
    return markdown.replace(/^#\s+References[\s\S]*$/m, '');
}

/**
 * Format markdown for display in the modal
 * @param {string} markdown - The raw markdown content
 * @returns {string} Formatted markdown ready for conversion to HTML
 */
export function formatMarkdownForModal(markdown) {
    if (!markdown) return '';
    
    // Remove references section
    const withoutReferences = removeReferences(markdown);
    
    // Remove academic outlook section if present
    const withoutOutlook = withoutReferences.replace(/^#\s+Academic Outlook[\s\S]*(?:^#|$)/m, '');
    
    return withoutOutlook.trim();
}