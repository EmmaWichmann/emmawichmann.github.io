const text = "Emma Wichmann";
const el = document.getElementById("typewriter");
let i = 0;

function typeLetter() {
  if (i < text.length) {
    el.textContent += text.charAt(i);
    i++;
    setTimeout(typeLetter, 100);
  }
}

typeLetter();
