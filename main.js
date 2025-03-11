// "The only thing to do with good code is to pass it on. It is never of any use unexecuted."
document.addEventListener('DOMContentLoaded', function() {
    // Make FAQ accordion work its intellectual magic
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Properly set up all FAQ items
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const expandIcon = item.querySelector('.expand-icon');
        
        // Set a data attribute to track state
        item.setAttribute('data-open', index === 0 ? 'true' : 'false');
        
        // Set initial visual state
        if (index === 0) {
            // First item starts open
            answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
            answer.style.padding = '0 1.5rem 1.5rem';
            expandIcon.style.transform = 'rotate(45deg)';
        } else {
            // All other items start closed
            answer.style.maxHeight = null;
            answer.style.padding = '0 1.5rem';
            expandIcon.style.transform = 'rotate(0deg)';
        }
        
        question.addEventListener('click', function() {
            // Check current state
            const wasOpen = item.getAttribute('data-open') === 'true';
            
            // Close all items first
            faqItems.forEach(otherItem => {
                const otherAnswer = otherItem.querySelector('.faq-answer');
                const otherIcon = otherItem.querySelector('.expand-icon');
                otherItem.setAttribute('data-open', 'false');
                otherAnswer.style.maxHeight = null;
                otherAnswer.style.padding = '0 1.5rem';
                otherIcon.style.transform = 'rotate(0deg)';
            });
            
            // If this item wasn't open before, open it now
            if (!wasOpen) {
                item.setAttribute('data-open', 'true');
                answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
                answer.style.padding = '0 1.5rem 1.5rem';
                expandIcon.style.transform = 'rotate(45deg)';
            }
            // Now when wasOpen is true, it will stay closed because we closed all items above
        });
    });
    
    // Add more irresistibly witty FAQ items dynamically
    const faqAccordion = document.querySelector('.faq-accordion');
    
    const additionalFaqs = [
        {
            question: "Isn't this just plagiarism with extra steps?",
            answer: "Plagiarism is taking someone else's work without attribution. This is generating entirely new work that never existed before. It's like the difference between stealing a painting and commissioning an artist to paint something similar. One gets you arrested, the other gets you praised for your discerning taste. Though we do suggest you read whatever you submit—ignorance may be bliss, but it makes for awkward questions during oral examinations"
        },
        {
            question: "What if my professor recognizes I couldn't possibly have written this?",
            answer: "Ah, the curse of sudden brilliance! We suggest a gradual approach to intellectual transformation. Perhaps don't go from writing like a sleep-deprived hamster to Foucault overnight. Our 'Basic' creativity level exists for a reason—it's the academic equivalent of not wearing a tuxedo to a fast food restaurant. If you must suddenly display genius, consider developing a backstory about a transformative summer reading experience or a new vitamin regimen"
        },
        {
            question: "Do you offer a 'make this sound like I wrote it at 3 AM' option?",
            answer: "While we don't explicitly offer a 'desperate procrastinator' style preset, you can always edit our polished work to insert a strategic typo or two, remove several Oxford commas, and replace sophisticated transitions with 'and then' or 'also.' For the authentic 3 AM experience, randomly delete a citation and replace one paragraph with a slightly off-topic rant. Your professor will never suspect you had help"
        },
        {
            question: "How do I explain my sudden expertise in quantum mechanics?",
            answer: "The same way one explains any unexpected talent: vague references to 'always being interested in the subject' or having 'picked it up during the pandemic.' If pressed further, mention a distant relative who works in the field or claim you've been watching a lot of documentaries lately. Remember, the truly educated person knows how to nod thoughtfully while saying very little. A strategically placed 'it's complicated' can work wonders"
        }
    ];
    
    additionalFaqs.forEach(faq => {
        const faqItem = document.createElement('div');
        faqItem.className = 'faq-item';
        
        faqItem.innerHTML = `
            <div class="faq-question">
                <h3>${faq.question}</h3>
                <div class="expand-icon">+</div>
            </div>
            <div class="faq-answer">
                <p>${faq.answer}</p>
            </div>
        `;
        
        faqAccordion.appendChild(faqItem);
        
        // Add event listener to newly created FAQ item
        const question = faqItem.querySelector('.faq-question');
        const answer = faqItem.querySelector('.faq-answer');
        const expandIcon = faqItem.querySelector('.expand-icon');
        
        // Set initial state to closed with data attribute
        faqItem.setAttribute('data-open', 'false');
        answer.style.maxHeight = null;
        answer.style.padding = '0 1.5rem';
        expandIcon.style.transform = 'rotate(0deg)';
        
        question.addEventListener('click', function() {
            // Check current state
            const wasOpen = faqItem.getAttribute('data-open') === 'true';
            
            // Close all items
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                const otherAnswer = otherItem.querySelector('.faq-answer');
                const otherIcon = otherItem.querySelector('.expand-icon');
                otherItem.setAttribute('data-open', 'false');
                otherAnswer.style.maxHeight = null;
                otherAnswer.style.padding = '0 1.5rem';
                otherIcon.style.transform = 'rotate(0deg)';
            });
            
            // If this item wasn't open before, open it now
            if (!wasOpen) {
                faqItem.setAttribute('data-open', 'true');
                answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
                answer.style.padding = '0 1.5rem 1.5rem';
                expandIcon.style.transform = 'rotate(45deg)';
            }
            // Now it will stay closed if it was open before
        });
    });
    
    // Update existing FAQ content with even wittier prose - without unnecessary periods
    const existingFaqAnswers = [
        "That's a philosophical question, isn't it? Our service is designed as a research and learning tool. We provide papers that can serve as advanced study guides, reference materials, or inspiration for your own work. Using our papers as your own submission without proper attribution would be academically dishonest, which we absolutely do not encourage. But we can't control what you do with our content once it's in your hands, just like a knife manufacturer can't control whether you use their product to spread butter or commit crimes against haute cuisine",
        
        "Yes, our papers are specifically engineered to bypass common AI detection systems. We use a sophisticated process that produces text indistinguishable from human writing—much like how certain politicians sound almost human despite evidence to the contrary. That said, we continuously update our methods as detection technology evolves. For additional security, we recommend making minor edits to further personalize the content. After all, nothing says 'definitely written by a human' like the occasional inexplicable tangent or bizarre metaphor",
        
        "Basic papers are typically ready within 30 minutes—less time than it takes most students to decide which procrastination technique to employ next. More complex work like Master's or PhD level content may take 1-2 hours. If you select our 'Hardcore' quality control option, add another hour as our system performs extensive verification and refinement. Still faster than reading the source material, and considerably more enjoyable than pretending to understand Derrida",
        
        "We offer one free revision within 24 hours of delivery, because even our sophisticated AI occasionally misunderstands briefs, much like professors misunderstand the concept of 'reasonable workload.' If you're still unhappy after the revision, we provide a 70% refund. We retain 30% to cover our operational costs and the therapy our developers need after reading thousands of academic papers. However, our satisfaction rate is over 98%, so this rarely happens—unlike your intention to start that assignment early",
        
        "Yes, once delivered, the content belongs to you, much like that gym membership you haven't used since January. You can use it as you see fit—reference material, learning aid, or... other academic purposes we couldn't possibly imagine. Our system generates unique content for each order, ensuring you receive original material that won't be provided to anyone else. It's exclusivity without the membership fee or secret handshake",
        
        "We take extensive precautions to ensure your privacy and anonymity—more security than most people use for their online banking. We don't store your papers after delivery, we use secure payment processing, and we never share your information. That said, we recommend using the papers as reference rather than submitting them directly—partly for ethical reasons, but also because professors may recognize when a student suddenly writes at a different level than usual. 'Yesterday you thought a thesis statement was a type of furniture, and today you're channeling Chomsky?' raises questions"
    ];
    
    document.querySelectorAll('.faq-item').forEach((item, index) => {
        if (index < existingFaqAnswers.length) {
            const answerP = item.querySelector('.faq-answer p');
            if (answerP) {
                answerP.innerHTML = existingFaqAnswers[index];
            }
        }
    });
    
    // ===========================
    // PRICING SECTION SYNC - TOM'S MASTERPIECE
    // ===========================
    
    // Track the currently selected options in the pricing section
    let selectedPricingOptions = {
        paperScope: 'Seminar Paper',
        paperScopePrice: 0,
        creativityLevel: 'Basic',
        creativityLevelPrice: 0,
        qualityControl: 'Basic',
        qualityControlPrice: 0
    };
    
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
                const price = parseInt(this.dataset.price || 0);
                
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
                
                // Calculate new total
                let total = 5; // Base price
                document.querySelectorAll('.option.selected').forEach(selectedOption => {
                    total += parseInt(selectedOption.dataset.price || 0);
                });
                
                // Update total display with animation
                totalPrice.textContent = '$' + total;
                totalPrice.classList.add('price-updated');
                setTimeout(() => {
                    totalPrice.classList.remove('price-updated');
                }, 500);
            });
        });
    }

    // ===========================
    // Paper Form Modal Functionality
    // ===========================
    
    // Modal elements
    const modal = document.getElementById('paperFormModal');
    const modalClose = modal.querySelector('.modal-close');
    const paperForm = modal.querySelector('.paper-form');
    
    // Pricing elements inside modal
    const paperTypePrice = document.getElementById('paper-type-price');
    const creativityPrice = document.getElementById('creativity-price');
    const qualityPrice = document.getElementById('quality-price');
    const modalTotalPrice = modal.querySelector('.modal-price');
    
    // Price configurations
    const paperTypePrices = {
        'seminar': 0,
        'bachelor': 10,
        'master': 15,
        'academic': 20,
        'phd': 30
    };
    
    const creativityLevelPrices = [0, 5, 10, 15, 25]; // index corresponds to level - 1
    
    const qualityControlPrices = {
        'basic': 0,
        'advanced': 10,
        'hardcore': 25
    };
    
    // Mappings for synchronizing between pricing section and modal
    const paperTypeMapping = {
        'Seminar Paper': 'seminar',
        'Bachelor Thesis': 'bachelor',
        'Master Thesis': 'master',
        'Academic Paper': 'academic',
        'PhD Thesis': 'phd'
    };
    
    const creativityLevelMapping = {
        'Basic': 1,
        'Advanced': 2,
        'Expert': 3,
        'Master': 4,
        'Insane': 5
    };
    
    const qualityControlMapping = {
        'Basic': 'basic',
        'Advanced': 'advanced',
        'Hardcore': 'hardcore'
    };
    
    // Function to open modal with selected pricing options
    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
        
        // Reset form first
        paperForm.reset();
        
        // Then apply selected options from pricing section
        applySelectedPricingOptions();
        
        // Update pricing in the modal
        updateModalPrices();
        
        // Focus on first input
        setTimeout(() => {
            const firstInput = modal.querySelector('input[type="text"]');
            if (firstInput) firstInput.focus();
        }, 400);
    }
    
    // Apply selected options from pricing section to modal
    function applySelectedPricingOptions() {
        // Set paper type
        const paperTypeValue = paperTypeMapping[selectedPricingOptions.paperScope];
        if (paperTypeValue) {
            const paperTypeRadio = document.querySelector(`input[name="paper-type"][value="${paperTypeValue}"]`);
            if (paperTypeRadio) paperTypeRadio.checked = true;
        }
        
        // Set creativity level
        const creativityLevel = creativityLevelMapping[selectedPricingOptions.creativityLevel];
        if (creativityLevel) {
            const creativitySlider = document.getElementById('creativity-level');
            creativitySlider.value = creativityLevel;
            
            // Update the slider labels UI
            updateCreativitySliderLabels(creativityLevel);
        }
        
        // Set quality control
        const qualityValue = qualityControlMapping[selectedPricingOptions.qualityControl];
        if (qualityValue) {
            const qualityRadio = document.querySelector(`input[name="quality-control"][value="${qualityValue}"]`);
            if (qualityRadio) qualityRadio.checked = true;
        }
    }
    
    // Function to update creativity slider label highlights
    function updateCreativitySliderLabels(level) {
        const sliderLabels = document.querySelectorAll('.slider-labels span');
        sliderLabels.forEach((label, index) => {
            if (index === level - 1) {
                label.style.fontWeight = '700';
                label.style.color = 'var(--secondary)';
            } else {
                label.style.fontWeight = '400';
                label.style.color = 'var(--light-text)';
            }
        });
    }
    
    // Function to close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Calculate and update prices in the modal
    function updateModalPrices() {
        // Get selected paper type
        const selectedPaperType = document.querySelector('input[name="paper-type"]:checked').value;
        const paperTypeValue = paperTypePrices[selectedPaperType];
        paperTypePrice.innerHTML = `<span>Paper type:</span><span>+$${paperTypeValue.toFixed(2)}</span>`;
        
        // Get creativity level
        const creativityLevel = parseInt(document.getElementById('creativity-level').value);
        const creativityValue = creativityLevelPrices[creativityLevel - 1];
        creativityPrice.innerHTML = `<span>Creativity level:</span><span>+$${creativityValue.toFixed(2)}</span>`;
        
        // Get quality control
        const selectedQuality = document.querySelector('input[name="quality-control"]:checked').value;
        const qualityValue = qualityControlPrices[selectedQuality];
        qualityPrice.innerHTML = `<span>Quality control:</span><span>+$${qualityValue.toFixed(2)}</span>`;
        
        // Calculate total
        const total = 5 + paperTypeValue + creativityValue + qualityValue;
        modalTotalPrice.textContent = `$${total.toFixed(2)}`;
        modalTotalPrice.classList.add('price-pulse');
        setTimeout(() => {
            modalTotalPrice.classList.remove('price-pulse');
        }, 500);
    }
    
    // Add event listeners to pricing section CTA button
    const pricingCTA = document.querySelector('.pricing-cta .cta-button');
    if (pricingCTA) {
        pricingCTA.addEventListener('click', openModal);
    }
    
    // Add event listeners to all other CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button:not(.pricing-cta .cta-button)');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Reset to default options when opened from buttons outside pricing section
            selectedPricingOptions = {
                paperScope: 'Seminar Paper',
                paperScopePrice: 0,
                creativityLevel: 'Basic',
                creativityLevelPrice: 0,
                qualityControl: 'Basic',
                qualityControlPrice: 0
            };
            
            openModal();
        });
    });
    
    // Close modal when clicking the close button
    modalClose.addEventListener('click', closeModal);
    
    // Close modal when clicking outside the modal content
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Close modal when pressing Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Update pricing when selections change
    document.querySelectorAll('input[name="paper-type"]').forEach(radio => {
        radio.addEventListener('change', updateModalPrices);
    });
    
    document.getElementById('creativity-level').addEventListener('input', function() {
        updateCreativitySliderLabels(parseInt(this.value));
        updateModalPrices();
    });
    
    document.querySelectorAll('input[name="quality-control"]').forEach(radio => {
        radio.addEventListener('change', updateModalPrices);
    });
    
    // Handle form submission
    paperForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form values
        const paperTopic = document.getElementById('paper-topic').value;
        const academicDiscipline = document.getElementById('academic-discipline').value;
        const paperType = document.querySelector('input[name="paper-type"]:checked').value;
        const creativityLevel = document.getElementById('creativity-level').value;
        const qualityControl = document.querySelector('input[name="quality-control"]:checked').value;
        const email = document.getElementById('email').value;
        
        // Simulate form submission
        const submitButton = paperForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Processing...';
        submitButton.disabled = true;
        
        // Simulate API call with timeout
        setTimeout(() => {
            // Here you would normally send data to server
            console.log('Paper requested:', {
                topic: paperTopic,
                discipline: academicDiscipline,
                type: paperType,
                creativityLevel: creativityLevel,
                qualityControl: qualityControl,
                email: email
            });
            
            // Reset button
            submitButton.textContent = 'Success! Redirecting...';
            
            // Close modal after delay
            setTimeout(() => {
                closeModal();
                // Reset button text after modal is closed
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 500);
            }, 1500);
        }, 2000);
    });
    
    // Add creativity level slider labels highlighting
    const creativitySlider = document.getElementById('creativity-level');
    const sliderLabels = document.querySelectorAll('.slider-labels span');
    
    // Set initial slider label highlight
    sliderLabels[0].style.fontWeight = '700';
    sliderLabels[0].style.color = 'var(--secondary)';
    
    // Initialize the pricing in the modal
    updateModalPrices();
});