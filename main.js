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
    
    // Handle total price calculation on pricing page
    const priceOptions = document.querySelectorAll('.option');
    const totalPrice = document.querySelector('.total-price .price');
    
    if (priceOptions.length > 0 && totalPrice) {
        priceOptions.forEach(option => {
            option.addEventListener('click', function() {
                const category = this.closest('.option-category');
                const categoryOptions = category.querySelectorAll('.option');
                
                // Deselect other options in this category
                categoryOptions.forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Select this option
                this.classList.add('selected');
                
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
});