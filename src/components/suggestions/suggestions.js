// Suggestions Module
// Provides witty, discipline-specific suggestions for form fields

/**
 * Get a paper topic suggestion based on academic discipline
 * @param {string} discipline - The selected academic discipline
 * @returns {string} A witty paper topic suggestion
 */
export function getPaperTopicSuggestion(discipline) {
    const suggestions = {
        '': 'The Inevitable Obsolescence of Human Thought: How AI-Generated Papers Expose Academic Pretentiousness',
        'economics': 'The Economic Paradox of Student Loans: Investing in Knowledge While Drowning in Debt',
        'history': 'Procrastination Through the Ages: A Historical Analysis of Getting Things Done Tomorrow',
        'literature': 'The Dorian Gray Effect: How Classic Literature Remains Unchanged While Its Readers Age Terribly',
        'philosophy': 'I Think Therefore I Cram: Existential Crises During Final Exams',
        'psychology': 'The Psychology of Deadline Denial: Why We Believe We Work Best Under Pressure',
        'sociology': 'Coffee Shop Academia: How Pretending to Write in Public Places Became Cultural Currency',
        'sciences': 'Quantum Procrastination: Why Tasks Exist in Multiple States Until the Night Before Deadlines',
        'arts': 'The Aesthetic Value of Sleep Deprivation: How Exhaustion Became the Artistic Standard',
        'business': 'The Corporate Ladder as a Hamster Wheel: A Quantitative Analysis of Career Advancement Futility',
        'engineering': 'Optimal Caffeine Distribution Systems: Engineering the Perfect All-Nighter',
        'medicine': 'Self-Diagnosis of Academic Burnout: A Medical Investigation of Syllabus Shock',
        'law': 'Legal Precedents for Extension Requests: A Comprehensive Analysis of Excuses That Work',
        'other': 'The Meta-Academic Paradox: Writing About Not Writing While Not Writing'
    };
    
    return suggestions[discipline] || suggestions['other'];
}

/**
 * Get a paper focus suggestion based on academic discipline
 * @param {string} discipline - The selected academic discipline
 * @returns {string} A witty focus suggestion
 */
export function getPaperFocusSuggestion(discipline) {
    const suggestions = {
        '': 'Focus on the ethical implications of outsourcing one\'s intellectual obligations to silicon-based entities',
        'economics': 'Focus on the inverse relationship between tuition costs and student motivation',
        'history': 'Focus on how deadlines have historically been more of a suggestion than a requirement',
        'literature': 'Focus on the symbolism of empty coffee cups as modern academic totems',
        'philosophy': 'Focus on whether a paper exists if no professor reads it',
        'psychology': 'Focus on the five stages of grief when realizing the paper is due tomorrow',
        'sociology': 'Focus on the social hierarchy of university libraries during finals week',
        'sciences': 'Focus on the correlation between scientific breakthroughs and accidental all-nighters',
        'arts': 'Focus on the artistic merits of last-minute inspiration versus planned creativity',
        'business': 'Focus on the inverse relationship between meeting frequency and actual productivity',
        'engineering': 'Focus on optimizing the ratio of research time to actual writing time',
        'medicine': 'Focus on the physiological effects of replacing blood with energy drinks',
        'law': 'Focus on the legal definition of "I\'ll finish it this weekend" and its enforceability',
        'other': 'Focus on the inverse relationship between time spent on this paper and its actual importance',
    };
    
    return suggestions[discipline] || suggestions['other'];
}

/**
 * Get additional suggestions based on academic discipline
 * @param {string} discipline - The selected academic discipline
 * @returns {string} A witty additional suggestion
 */
export function getAdditionalSuggestion(discipline) {
    const suggestions = {
        '': 'Perhaps explore how professors who can\'t distinguish AI writing are precisely those who should fear it most',
        'economics': 'Consider the market efficiency of buying papers versus the opportunity cost of writing them',
        'history': 'Perhaps include primary sources that you\'ve definitely read and not just skimmed the night before',
        'literature': 'Consider comparing obscure works nobody has read but everyone pretends to understand',
        'philosophy': 'Perhaps question whether the professor reading this paper is merely a figment of your imagination',
        'psychology': 'Consider analyzing the cognitive dissonance between what students say they\'ll do and actually do',
        'sociology': 'Perhaps examine the social construct of deadlines as a tool of academic oppression',
        'sciences': 'Consider including graphs that look impressive but are intentionally too complex to understand',
        'arts': 'Perhaps argue that your formatting inconsistencies are actually a postmodern artistic statement',
        'business': 'Perhaps explore how corporate jargon serves as a substitute for actual innovation and problem-solving',
        'engineering': 'Consider including a diagram of the perfect paper-writing machine that hasn\'t been built yet',
        'medicine': 'Perhaps diagnose academia with a severe case of publication addiction',
        'law': 'Consider citing cases that sound legitimate but would require too much effort to verify',
        'other': 'Perhaps include unnecessarily complex terminology to disguise the fact that you have no idea what you\'re talking about'
    };
    
    return suggestions[discipline] || suggestions['other'];
}