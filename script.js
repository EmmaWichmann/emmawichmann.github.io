document.addEventListener("DOMContentLoaded", () => {
  const nameElement = document.getElementById("typewriter-name");
  
  if (nameElement) {
    const originalText = nameElement.textContent;
    nameElement.textContent = "";
    let index = 0;

    function typeEffect() {
      if (index < originalText.length) {
        nameElement.textContent += originalText.charAt(index);
        index++;
        setTimeout(typeEffect, 90); 
      }
    }
    
    // Smooth initial execution delay
    setTimeout(typeEffect, 300);
  }
});
