// Markdown Utilities
// Functions for handling markdown conversion and formatting

/**
 * Convert markdown text to HTML
 * @param {string} markdown - The markdown text to convert
 * @returns {string} The converted HTML
 */
export function markdownToHtml(markdown) {
    if (!markdown) return '';
    
    // Replace escaped characters first
    markdown = markdown
        .replace(/\\-/g, '-')
        .replace(/\\'/g, "'")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');
    
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
    
    // Process unordered lists
    // First, mark list items
    let inList = false;
    const lines = markdown.split('\n');
    for (let i = 0; i < lines.length; i++) {
        if (/^\s*[-*+]\s+(.+)$/.test(lines[i])) {
            // This is a list item
            lines[i] = lines[i].replace(/^\s*[-*+]\s+(.+)$/, '<li>$1</li>');
            
            // Add list opening tag if not already in a list
            if (!inList) {
                lines[i] = '<ul>' + lines[i];
                inList = true;
            }
        } else if (inList && lines[i].trim() === '') {
            // Empty line after list - close the list
            lines[i-1] = lines[i-1] + '</ul>';
            inList = false;
        } else if (inList && i === lines.length - 1) {
            // End of content while still in a list - close the list
            lines[i] = lines[i] + '</ul>';
            inList = false;
        }
    }
    
    // If we ended the content still in a list, close it
    if (inList) {
        lines[lines.length - 1] += '</ul>';
    }
    
    markdown = lines.join('\n');
    
    // Process ordered lists (similar approach as unordered lists)
    inList = false;
    const lines2 = markdown.split('\n');
    for (let i = 0; i < lines2.length; i++) {
        if (/^\s*(\d+)\.\s+(.+)$/.test(lines2[i])) {
            // This is a list item
            lines2[i] = lines2[i].replace(/^\s*(\d+)\.\s+(.+)$/, '<li>$2</li>');
            
            // Add list opening tag if not already in a list
            if (!inList) {
                lines2[i] = '<ol>' + lines2[i];
                inList = true;
            }
        } else if (inList && lines2[i].trim() === '') {
            // Empty line after list - close the list
            lines2[i-1] = lines2[i-1] + '</ol>';
            inList = false;
        } else if (inList && i === lines2.length - 1) {
            // End of content while still in a list - close the list
            lines2[i] = lines2[i] + '</ol>';
            inList = false;
        }
    }
    
    // If we ended the content still in a list, close it
    if (inList) {
        lines2[lines2.length - 1] += '</ol>';
    }
    
    markdown = lines2.join('\n');
    
    // Process blockquotes
    inList = false; // Reuse this variable to track if we're in a blockquote
    const lines3 = markdown.split('\n');
    for (let i = 0; i < lines3.length; i++) {
        if (/^\s*>\s+(.+)$/.test(lines3[i])) {
            // This is a blockquote line
            lines3[i] = lines3[i].replace(/^\s*>\s+(.+)$/, '<blockquote>$1</blockquote>');
            
            // Don't handle nested blockquotes for simplicity
        }
    }
    
    markdown = lines3.join('\n');
    
    // Process horizontal rules (---)
    markdown = markdown.replace(/^---$/gm, '<hr>');
    
    // Process paragraphs (new line as paragraph break)
    // First, replace single newlines with line breaks
    const processParagraphs = text => {
        // Split by double newlines (paragraph breaks)
        const paragraphs = text.split(/\n\n+/);
        
        return paragraphs.map(p => {
            // Skip if this is already a tag
            if (/^<(\w+)/.test(p.trim())) return p;
            
            // Replace single newlines with <br>
            const withBreaks = p.replace(/\n/g, '<br>');
            
            // Wrap in paragraph tags if not empty
            return withBreaks.trim() ? `<p>${withBreaks}</p>` : '';
        }).join('\n');
    };
    
    markdown = processParagraphs(markdown);
    
    // Fix nested tags
    // This is a simplistic approach - a proper parser would be better
    markdown = markdown
        .replace(/<p><(h[1-6]|ul|ol|pre|blockquote)/g, '<$1')
        .replace(/(<\/(h[1-6]|ul|ol|pre|blockquote)>)<\/p>/g, '$1');
    
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
    
    // Limit the content to a reasonable amount for preview
    let limitedContent = withoutOutlook.trim();
    
    // If content is very long, truncate it
    if (limitedContent.length > 10000) {
        // Find a good cutoff point - preferably at a section heading
        const lastHeadingMatch = limitedContent.slice(0, 10000).match(/^#\s+[^\n]+$/gm);
        if (lastHeadingMatch && lastHeadingMatch.length > 1) {
            // Cut off after the second-to-last heading found
            const lastIndex = limitedContent.lastIndexOf(lastHeadingMatch[lastHeadingMatch.length - 2]);
            if (lastIndex > 0) {
                limitedContent = limitedContent.slice(0, lastIndex) + 
                    '\n\n## Preview Truncated\n\nThis is a preview of the paper. The full version would continue beyond this point.';
            }
        } else {
            // If no good cutoff point, just truncate at 10000 chars
            limitedContent = limitedContent.slice(0, 10000) + 
                '\n\n## Preview Truncated\n\nThis is a preview of the paper. The full version would continue beyond this point.';
        }
    }
    
    return limitedContent;
}