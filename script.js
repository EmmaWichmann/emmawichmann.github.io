const phrases = [
  "Emma Wichmann.",
  "a Data Systems Coordinator.",
  "a QA Tester.",
  "a Lab Operations Specialist."
];

let currentPhraseIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
const typewriterElement = document.getElementById("typewriter");

function type() {
  const currentPhrase = phrases[currentPhraseIndex];

  if (isDeleting) {
    // Delete characters
    typewriterElement.textContent = currentPhrase.substring(0, currentCharIndex - 1);
    currentCharIndex--;
  } else {
    // Type characters
    typewriterElement.textContent = currentPhrase.substring(0, currentCharIndex + 1);
    currentCharIndex++;
  }

  // Speed configuration variables
  let typingSpeed = isDeleting ? 40 : 80;

  // Phrase complete behavior
  if (!isDeleting && currentCharIndex === currentPhrase.length) {
    typingSpeed = 2200; // Pause at the end of the full phrase
    isDeleting = true;
  } else if (isDeleting && currentCharIndex === 0) {
    isDeleting = false;
    currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length; // Loop around infinitely
    typingSpeed = 400; // Pause before beginning next phrase execution
  }

  setTimeout(type, typingSpeed);
}

// Fire execution matrices safely when DOM processes settle
document.addEventListener("DOMContentLoaded", () => {
  if (typewriterElement) {
    type();
  }
});
