// FAQ Module
// Handles the FAQ accordion functionality and dynamic content

/**
 * Initialize the FAQ accordion functionality
 */
export function initFAQ() {
    renderAllFAQs();
    setupFAQAccordion();
}

/**
 * Render all FAQs from our centralized data
 */
function renderAllFAQs() {
    const faqAccordion = document.querySelector('.faq-accordion');
    
    // Clear any existing FAQ items (in case of re-initialization)
    faqAccordion.innerHTML = '';
    
    // Get all FAQ items from our centralized data
    const allFaqs = getAllFAQs();
    
    // Create and append each FAQ item
    allFaqs.forEach((faq, index) => {
        const faqItem = createFAQItem(faq.question, faq.answer);
        // First item starts open
        faqItem.setAttribute('data-open', index === 0 ? 'true' : 'false');
        faqAccordion.appendChild(faqItem);
    });
}

/**
 * Set up the accordion behavior for FAQ items
 */
function setupFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Properly set up all FAQ items
    faqItems.forEach((item) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const expandIcon = item.querySelector('.expand-icon');
        
        // Set initial visual state
        if (item.getAttribute('data-open') === 'true') {
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
            closeAllFAQItems();
            
            // If this item wasn't open before, open it now
            if (!wasOpen) {
                openFAQItem(item);
            }
            // Now when wasOpen is true, it will stay closed because we closed all items above
        });
    });
}

/**
 * Close all FAQ items
 */
function closeAllFAQItems() {
    const items = document.querySelectorAll('.faq-item');
    items.forEach(item => {
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.expand-icon');
        item.setAttribute('data-open', 'false');
        answer.style.maxHeight = null;
        answer.style.padding = '0 1.5rem';
        icon.style.transform = 'rotate(0deg)';
    });
}

/**
 * Open a specific FAQ item
 * @param {HTMLElement} item - The FAQ item to open
 */
function openFAQItem(item) {
    const answer = item.querySelector('.faq-answer');
    const expandIcon = item.querySelector('.expand-icon');
    item.setAttribute('data-open', 'true');
    answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
    answer.style.padding = '0 1.5rem 1.5rem';
    expandIcon.style.transform = 'rotate(45deg)';
}

/**
 * Create a new FAQ item element
 * @param {string} questionText - The FAQ question
 * @param {string} answerText - The FAQ answer
 * @returns {HTMLElement} - The created FAQ item element
 */
function createFAQItem(questionText, answerText) {
    const faqItem = document.createElement('div');
    faqItem.className = 'faq-item';
    
    faqItem.innerHTML = `
        <div class="faq-question">
            <h3>${questionText}</h3>
            <div class="expand-icon">+</div>
        </div>
        <div class="faq-answer">
            <p>${answerText}</p>
        </div>
    `;
    
    // Set initial state to closed with data attribute
    faqItem.setAttribute('data-open', 'false');
    const answer = faqItem.querySelector('.faq-answer');
    const expandIcon = faqItem.querySelector('.expand-icon');
    answer.style.maxHeight = null;
    answer.style.padding = '0 1.5rem';
    expandIcon.style.transform = 'rotate(0deg)';
    
    return faqItem;
}

/**
 * Get all FAQ data in one centralized place
 * @returns {Array} Array of FAQ objects with question and answer properties
 */
function getAllFAQs() {
    return [
        {
            question: "What exactly is Paper Mill, and why should I care?",
            answer: "Paper Mill is the academic equivalent of having a brilliant, caffeinated ghost writer who never sleeps, complains, or asks for more money. We use sophisticated AI to generate high-quality academic papers from minimal input: just provide a title or theme, and we'll handle the rest. It's like having a team of PhD candidates locked in your basement, except legal and without the feeding requirements. Perfect for those who appreciate the destination of knowledge far more than the journey of acquiring it.<br><br>A personal confession: I tested this system with the same topic as my bachelor thesis, a paper that took me six agonizing weeks of caffeine-fueled despair to complete. The Paper Mill version, generated in under five minutes, was not only better structured and more eloquent, but also cited sources I hadn't discovered after weeks of research. That's when I knew this wasn't just another AI tool, but academic alchemy that turns procrastination into productivity"
        },
        {
            question: "Is this actually ethical, like, really?",
            answer: "Ethics are like jazz: complex, open to interpretation, and occasionally uncomfortable at dinner parties. Our service is designed as a research and learning tool that provides sophisticated study guides and reference materials. We equip you with academic firepower; how you deploy it is between you, your conscience, and that professor who insists on scheduling papers due the Monday after spring break. We include disclaimers about academic integrity because we genuinely believe in education, we just believe convenience doesn't have to be its nemesis"
        },
        {
            question: "How does your pricing work, I'm balancing student loans and a ramen budget?",
            answer: "Our pricing reflects the culinary world: you can get the basic dish for $5, or add various gourmet touches. Higher academic levels (from bachelor to PhD) cost progressively more (+$10 to +$30), as do creativity levels (from \"sounds like a textbook\" to \"might win a Pulitzer\" at +$5 to +$25). Quality control options range from \"it'll do\" to \"hardcore academic scrutiny\" (+$10 to +$25). Unlike your streaming services, we charge per paper, no recurring subscriptions to forget about until they've funded someone's yacht. Think of it as investing in your peace of mind, delivered as a PDF and DOCX file"
        },
        {
            question: "How long does it take to create my academic masterpiece?",
            answer: "Our AI doesn't need coffee breaks, existential crises, or social media distractions. Most papers are ready within 5-10 minutes, roughly the time you spend deciding which study playlist best reflects your academic ambitions. The exact timing depends on a few factors: current AI traffic (Claude has many admirers), your selected complexity level (a sophisticated seminar paper on \"A Nietzschean Analysis of Gohan's Power Abandonment Post-Cell Games\" requires more contemplation than simpler topics), and the specific options you've chosen. It's rather like waiting for gourmet food versus fast food, except in our case, the gourmet option arrives almost as quickly. Even our most complex papers rarely take more than an hour (barring some catastrophic AI outage where the machines decide to collectively meditate). Compare that to the weeks of procrastination, panicked all-nighters, and deadline extensions you'd otherwise endure, and suddenly 10 minutes feels like time travel"
        },
        {
            question: "What makes your papers special, can't I just ask ChatGPT?",
            answer: "Asking ChatGPT to write your academic paper is like asking a kitchen knife to perform surgery: technically possible but lacking finesse and specific expertise. Our multi-stage process involves generating diverse perspectives, creating a master document, critiquing it, refining it, converting it to proper academic format, conducting peer review, and performing final quality testing. While other AI might give you text that vaguely resembles academia, we deliver papers that have been through more scrutiny than a politician's tax returns. The difference is in the details and the absence of hallucinated references"
        },
        {
            question: "Will my paper pass AI detection?",
            answer: "Our papers are designed to be indistinguishable from human writing, much like how certain politicians sound almost human despite evidence to the contrary. While Claude 3.7 Sonnet produces remarkably human-like text, we must emphasize there's no 100% guarantee in this cat-and-mouse game of AI detection. Be smart, dear customer <em>wink, wink</em> and never commit the cardinal sin of simply submitting our work verbatim. Read it. Absorb it. Make it yours with strategic edits and personal touches. This isn't just good academic practice; it's self-preservation. After all, nothing says \"definitely written by a human\" like replacing our perfectly crafted transition sentence with your characteristic run-on about how you had this epiphany while waiting for your ramen to cook at 2 AM"
        },
        {
            question: "What if my paper isn't what I expected, do you offer refunds?",
            answer: "Let's address expectations first: we deliver high-quality academic papers, not miracle cures for last-minute panic. Our sophisticated process includes rigorous internal testing for quality and that elusive \"definitely-written-by-a-sleep-deprived-human\" quality. If your paper fails our internal quality standards, you'll receive a full refund (though you won't receive the subpar paper). Beyond that, we don't offer revisions or refunds, our multi-stage AI process consumes more computational resources than your entire university's calculator budget for the 1990s. Consider it like commissioning fine art: once the creation process begins, the tokens start flowing and cannot be unclaimed. That said, our satisfaction rate exceeds 98%, which is higher than student satisfaction with both cafeteria food and 8 AM lectures combined. Most clients find our first draft surpasses what they'd produce after seventeen revisions and three existential crises"
        },
        {
            question: "Who owns the paper once it's delivered?",
            answer: "Once delivered, the content belongs entirely to you, like that exercise equipment gathering dust in your room, except potentially more useful. You receive original, unique content that won't be provided to anyone else. It's exclusivity without the velvet rope or secret handshake. Use it as reference material, learning aid, or... other academic purposes we couldn't possibly fathom. We're simply the brilliant mind behind the curtain, and once the curtain falls, the stage is yours"
        },
        {
            question: "How do you handle privacy, will my professor somehow find out?",
            answer: "Privacy is paramount, not because we have CIA-level security protocols, but because discretion is the cornerstone of our business model. We keep your information private through basic but effective measures: secure payment processing via Stripe and a \"need-to-know\" approach to data storage. Yes, we temporarily store your completed papers for delivery purposes, but everything except what's legally required for accounting is automatically purged from our systems one month after delivery, disappearing faster than your motivation after midterms. We're like that friend who knows what happened at the party but burns the evidence afterward. Your transaction and paper request remain confidential, we have zero interest in advertising \"Guess which Future Nobel Laureate used our services for their Intro to Philosophy paper!\" While we can't control if you shout our name from rooftops, we certainly won't be the ones telling your professor about our arrangement. Consider us academic ghosts: we appear, we deliver brilliance, and we vanish without a trace"
        },
        {
            question: "Can I request empirical research papers with original data?",
            answer: "Currently, we're the academic equivalent of an armchair philosopher - brilliant with theories but nowhere to be found when it's time to collect field samples. For Version 1, we stick exclusively to theoretical papers. Our roadmap includes expanding to empirical research in Version 2, when we'll master the art of presenting original findings without actually sending research assistants into the wild with clipboards. Until then, we recommend framing your needs within theoretical frameworks, or as we call it, \"harnessing the untapped potential of thought experiments.\" Remember, Einstein developed relativity without a particle accelerator - your paper can be just as groundbreaking from the comfort of your desk"
        },
        {
            question: "What do I need to do after receiving my paper?",
            answer: "Ah, the \"last mile\" of academic submission, we provide the brain, you provide the beauty. Our papers deliver pure intellectual content, but they arrive as academic nudists needing proper attire for your institution. You'll need to:<br><br>1. Format according to your university's exacting standards (often with LaTeX, the typesetting system designed to make simple tasks unnecessarily complex)<br>2. Add a title page with your institution's preferred arrangement of white space<br>3. Include acknowledgments thanking parents, advisors, and that one barista who kept you caffeinated<br>4. Insert headers, page numbers, and other formatting minutiae that professors scrutinize more closely than the actual content<br>5. Add footnotes where appropriate for that extra scholarly flair<br>6. Proofread and modify the content to better reflect your personal voice and knowledge<br><br>A word about references: while our quality control checks sources, no system is infallible, much like professors claiming they'll return papers \"next week.\" We strongly recommend verifying citations before submission. We know most of you won't actually do this (the same way you \"plan to start assignments early\"), but at least we've fulfilled our obligation to mention it. Consider it the academic equivalent of \"objects in mirror may be closer than they appear\", a warning that absolves us of responsibility while you speed toward your deadline"
        }
    ];
}