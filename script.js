const namePhrase = "Emma Wichmann.";
let charIndex = 0;
let isDeleting = false;
const typewriterElement = document.getElementById("typewriter");

function typeName() {
  if (isDeleting) {
    // Erase character
    typewriterElement.textContent = namePhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    // Type character
    typewriterElement.textContent = namePhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  let speed = isDeleting ? 60 : 100;

  // Logic boundaries for continuous looping
  if (!isDeleting && charIndex === namePhrase.length) {
    speed = 3000; // Pause for 3 full seconds on your name so people can read it clearly
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    speed = 500; // Small breath before starting to re-type
  }

  setTimeout(typeName, speed);
}

document.addEventListener("DOMContentLoaded", () => {
  if (typewriterElement) {
    typeName();
  }
});
