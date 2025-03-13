// Paper Wizard Animation - Improved
// A magical animation that transforms simple topics into academic papers

/**
 * Initialize the Paper Wizard Animation
 */
export function initPaperWizardAnimation() {
    // Get the animation container
    const heroVisual = document.querySelector('.hero-visualization');
    if (!heroVisual) return;
    
    // Clear existing content
    heroVisual.innerHTML = '';
    
    // Create our custom animation container
    const container = document.createElement('div');
    container.className = 'paper-wizard-container';
    
    // Insert HTML structure for the animation
    container.innerHTML = `
      <div class="wizard-animation-scene">
        <!-- Student character -->
        <div class="student-character">
          <div class="student-body"></div>
          <div class="student-head">
            <div class="student-face sad"></div>
          </div>
          <div class="thought-bubble">
            <div class="thought-text">Help!</div>
          </div>
        </div>
        
        <!-- Paper Mill Wizard -->
        <div class="wizard-character">
          <div class="wizard-hat"></div>
          <div class="wizard-head">
            <div class="wizard-face"></div>
          </div>
          <div class="wizard-beard"></div>
          <div class="wizard-body"></div>
          <div class="wizard-wand"></div>
        </div>
        
        <!-- Text Input -->
        <div class="topic-card">
          <div class="topic-prompt">Topic:</div>
          <div class="topic-text"></div>
          <div class="topic-cursor">|</div>
        </div>
        
        <!-- Magic Effects -->
        <div class="magic-particles"></div>
        
        <!-- Paper Output -->
        <div class="output-paper">
          <div class="paper-content">
            <div class="paper-header"></div>
            <div class="paper-title"></div>
            <div class="paper-lines">
              <div class="paper-line"></div>
              <div class="paper-line"></div>
              <div class="paper-line"></div>
              <div class="paper-line"></div>
              <div class="paper-line"></div>
              <div class="paper-line"></div>
              <div class="paper-section-title"></div>
              <div class="paper-line"></div>
              <div class="paper-line"></div>
              <div class="paper-line"></div>
              <div class="paper-references"></div>
            </div>
          </div>
          <div class="paper-grade">A-</div>
        </div>
        
        <!-- Beer Mug -->
        <div class="beer-mug">
          <div class="mug-body"></div>
          <div class="mug-handle"></div>
          <div class="mug-foam"></div>
        </div>
      </div>
    `;
    
    // Add the container to the hero visualization
    heroVisual.appendChild(container);
    
    // Initialize and start the animation sequence
    startAnimation();
  }
  
  // Data for the animation sequence
  const topicPairs = [
    {
      simple: "How to come back to the future?",
      academic: "Temporal Displacement Theory: A Multidisciplinary Analysis of Chronological Reversal Mechanisms"
    },
    {
      simple: "How to get rich?",
      academic: "Socioeconomic Capital Accumulation Strategies: A Comparative Framework for Wealth Generation"
    },
    {
      simple: "Why do I have to write this garbage?",
      academic: "The Pedagogical Value of Academic Writing: Cognitive Development Through Structured Discourse"
    },
    {
      simple: "What's the purpose of procrastination?",
      academic: "The Adaptive Utility of Procrastination: A Psychological Analysis of Delayed Task Execution"
    }
  ];
  
  // Track which topic we're showing
  let currentTopicIndex = 0;
  
  /**
   * Start the animation sequence
   */
  function startAnimation() {
    const scene = document.querySelector('.wizard-animation-scene');
    if (!scene) return;
    
    // Reset animation state
    resetAnimationState();
    
    // Step 1: Show student with sad face and "Help!" thought bubble
    scene.classList.add('show-student');
    
    // Step 2: After a delay, show the wizard
    setTimeout(() => {
      scene.classList.add('show-wizard');
      
      // Step 3: After another delay, show topic card and type text
      setTimeout(() => {
        scene.classList.add('show-topic');
        
        // Get current topic pair
        const topicPair = topicPairs[currentTopicIndex];
        currentTopicIndex = (currentTopicIndex + 1) % topicPairs.length;
        
        // Type the input text
        const topicText = document.querySelector('.topic-text');
        if (topicText) {
          typeText(topicText, topicPair.simple, () => {
            // After typing, wizard casts spell
            setTimeout(() => {
              startWizardSpell(scene, topicPair.academic);
            }, 800);
          });
        }
      }, 1200);
    }, 1000);
  }
  
  /**
   * Start the wizard spell casting animation
   * @param {HTMLElement} scene - The animation scene element
   * @param {string} academicTitle - The academic title to display
   */
  function startWizardSpell(scene, academicTitle) {
    // Step 4: Wizard casts spell
    scene.classList.add('wizard-casting');
    
    // Step 5: Show magic particles
    setTimeout(() => {
      scene.classList.add('show-magic');
      
      // Step 6: After spell effect, show the output paper
      setTimeout(() => {
        // Set the paper title text
        const paperTitle = document.querySelector('.paper-title');
        if (paperTitle) {
          paperTitle.textContent = academicTitle;
        }
        
        // Show the completed paper
        scene.classList.add('show-output');
        
        // Step 7: Change student's expression to happy and thought to "Yeah!"
        setTimeout(() => {
          const studentFace = document.querySelector('.student-face');
          const thoughtText = document.querySelector('.thought-text');
          
          if (studentFace) {
            studentFace.classList.remove('sad');
            studentFace.classList.add('happy');
          }
          
          if (thoughtText) {
            thoughtText.textContent = "Yeah!";
          }
          
          // Show beer mug
          scene.classList.add('show-beer');
          
          // Step 8: After a viewing period, reset and start again
          setTimeout(() => {
            resetAnimationState();
            setTimeout(() => {
              startAnimation();
            }, 500);
          }, 3000);
        }, 800);
      }, 1500);
    }, 500);
  }
  
  /**
   * Reset all animation states to start fresh
   */
  function resetAnimationState() {
    const scene = document.querySelector('.wizard-animation-scene');
    if (!scene) return;
    
    // Remove all animation state classes
    scene.classList.remove(
      'show-student',
      'show-wizard',
      'show-topic',
      'wizard-casting',
      'show-magic',
      'show-output',
      'show-beer'
    );
    
    // Reset student's face to sad
    const studentFace = document.querySelector('.student-face');
    if (studentFace) {
      studentFace.classList.remove('happy');
      studentFace.classList.add('sad');
    }
    
    // Reset thought text to "Help!"
    const thoughtText = document.querySelector('.thought-text');
    if (thoughtText) {
      thoughtText.textContent = "Help!";
    }
    
    // Clear any topic text content
    const topicText = document.querySelector('.topic-text');
    if (topicText) {
      topicText.textContent = '';
    }
  }
  
  /**
   * Type text character by character
   * @param {HTMLElement} element - Element to type text into
   * @param {string} text - Text to type
   * @param {Function} callback - Function to call when typing is complete
   */
  function typeText(element, text, callback) {
    let index = 0;
    element.textContent = '';
    
    function type() {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        setTimeout(type, 100);
      } else {
        if (callback) callback();
      }
    }
    
    type();
  }