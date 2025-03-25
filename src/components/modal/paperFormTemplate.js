// Paper Form Template Module
// Provides the HTML template for the paper form modal

/**
 * Get the HTML template for the paper form
 * @returns {string} The HTML template
 */
export function getPaperFormTemplate() {
    return `
        <form class="paper-form">
            <div class="form-group paper-topic-group">
                <label for="paper-topic">Your Paper Topic</label>
                <textarea id="paper-topic" name="paper-topic" class="paper-topic-textarea" placeholder="e.g., The impact of climate change on marine ecosystems" required rows="2"></textarea>
            </div>
            
            <div class="form-group optional-field-group">
                <button type="button" id="expand-focus" class="expand-field-button">
                    <span class="plus-icon">+</span> Add Focus Area (Optional)
                </button>
                <div id="focus-field-container" class="expandable-field">
                    <label for="paper-focus" class="secondary-label">Paper Focus (Optional)</label>
                    <textarea id="paper-focus" name="paper-focus" maxlength="200" class="focus-textarea" placeholder="Focus on specific aspects of your topic"></textarea>
                    <div class="char-counter"><span id="focus-char-count">0</span>/200</div>
                </div>
            </div>
            
            <div class="form-group optional-field-group">
                <button type="button" id="expand-additional" class="expand-field-button">
                    <span class="plus-icon">+</span> Add Additional Suggestions (Optional)
                </button>
                <div id="additional-field-container" class="expandable-field">
                    <label for="additional-suggestions" class="secondary-label">Additional Ideas & Suggestions (Optional)</label>
                    <textarea id="additional-suggestions" name="additional-suggestions" rows="4" class="suggestions-textarea" placeholder="Share any additional ideas or requirements"></textarea>
                </div>
            </div>
            
            <div class="form-group">
                <label for="academic-discipline">Academic Discipline</label>
                <select id="academic-discipline" name="academic-discipline" required>
                    <option value="" selected>Select your discipline</option>
                    <option value="economics">Economics</option>
                    <option value="history">History</option>
                    <option value="literature">Literature</option>
                    <option value="philosophy">Philosophy</option>
                    <option value="psychology">Psychology</option>
                    <option value="sociology">Sociology</option>
                    <option value="sciences">Natural Sciences</option>
                    <option value="arts">Arts & Humanities</option>
                    <option value="business">Business</option>
                    <option value="engineering">Engineering</option>
                    <option value="medicine">Medicine</option>
                    <option value="law">Law</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div id="other-discipline-group" class="form-group" style="display: none;">
                <label for="other-discipline">Please Specify Discipline</label>
                <input type="text" id="other-discipline" name="other-discipline" placeholder="Please specify your discipline">
            </div>
            
            <div class="form-group">
                <label>Paper Type</label>
                <div class="radio-options">
                    <label class="radio-label">
                        <input type="radio" name="paper-type" value="seminar" checked>
                        <span class="radio-text">Seminar Paper</span>
                    </label>
                    <label class="radio-label">
                        <input type="radio" name="paper-type" value="bachelor">
                        <span class="radio-text">Bachelor Thesis</span>
                    </label>
                    <label class="radio-label">
                        <input type="radio" name="paper-type" value="master">
                        <span class="radio-text">Master Thesis</span>
                    </label>
                    <label class="radio-label">
                        <input type="radio" name="paper-type" value="academic">
                        <span class="radio-text">Academic Paper</span>
                    </label>
                    <label class="radio-label">
                        <input type="radio" name="paper-type" value="phd">
                        <span class="radio-text">PhD Thesis</span>
                    </label>
                </div>
            </div>
            
            <div class="form-group">
                <label>Creativity Level</label>
                <div class="creativity-slider">
                    <input type="range" min="1" max="5" value="1" id="creativity-level" name="creativity-level">
                    <div class="slider-labels">
                        <span>Basic</span>
                        <span>Advanced</span>
                        <span>Expert</span>
                        <span>Master</span>
                        <span>Insane</span>
                    </div>
                </div>
            </div>
            
            <div class="form-group">
                <label>Quality Control</label>
                <div class="quality-options">
                    <label class="radio-label">
                        <input type="radio" name="quality-control" value="basic" checked>
                        <span class="radio-text">Basic</span>
                    </label>
                    <label class="radio-label">
                        <input type="radio" name="quality-control" value="advanced">
                        <span class="radio-text">Advanced</span>
                    </label>
                    <label class="radio-label">
                        <input type="radio" name="quality-control" value="hardcore">
                        <span class="radio-text">Hardcore</span>
                    </label>
                </div>
            </div>
            
            <div class="form-group">
                <label for="email">Your Email</label>
                <input type="email" id="email" name="email" placeholder="Where should we send your paper?" required>
            </div>
            
            <div class="pricing-summary">
                <div class="pricing-details">
                    <div class="price-row">
                        <span>Base price:</span>
                        <span>$5.00</span>
                    </div>
                    <div class="price-row" id="paper-type-price">
                        <span>Paper type:</span>
                        <span>+$0.00</span>
                    </div>
                    <div class="price-row" id="creativity-price">
                        <span>Creativity level:</span>
                        <span>+$0.00</span>
                    </div>
                    <div class="price-row" id="quality-price">
                        <span>Quality control:</span>
                        <span>+$0.00</span>
                    </div>
                    <div class="price-divider"></div>
                    <div class="price-row total">
                        <span>Total:</span>
                        <span class="modal-price">$5.00</span>
                    </div>
                </div>
            </div>
            
            <button type="submit" class="cta-button primary full-width">Generate My Paper</button>
            
            <p class="form-disclaimer">By clicking "Generate My Paper," you agree to our <a href="#terms" data-modal="terms">Terms of Service</a> and acknowledge that your paper will be delivered upon successful payment.</p>
            
            <p class="tax-notice">Additional taxes may apply depending on your location. The final amount will be calculated during checkout.</p>
        </form>
    `;
}