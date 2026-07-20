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

/* --- DARK MODE TOGGLE --- */
const themeToggle = document.getElementById("theme-toggle");
const rootEl = document.documentElement;

function applyTheme(theme) {
  rootEl.setAttribute("data-theme", theme);
  if (themeToggle) {
    themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  }
}

applyTheme(localStorage.getItem("theme") || "light");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const next = rootEl.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    applyTheme(next);
  });
}

/* --- SCROLL-REVEAL ANIMATIONS --- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".card").forEach((card) => revealObserver.observe(card));

/* --- PER-PROJECT LIVE ACTIVITY (stars / last updated on hover) + GARDEN STATUS --- */
function timeAgo(date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [label, secondsInUnit] of units) {
    const count = Math.floor(seconds / secondsInUnit);
    if (count >= 1) return `${count} ${label}${count > 1 ? "s" : ""} ago`;
  }
  return "moments ago";
}

function updateGardenStatus(mostRecentPush) {
  const statusText = document.getElementById("garden-status");
  const statusLog = statusText ? statusText.closest(".status-log") : null;
  if (!statusText || !mostRecentPush) return;

  const hoursSincePush = (Date.now() - mostRecentPush.getTime()) / 3600000;
  statusText.innerHTML = `<strong>Status:</strong> Last commit ${timeAgo(mostRecentPush)}`;

  if (statusLog) {
    statusLog.classList.toggle("fresh", hoursSincePush < 48);
  }
}

async function loadProjectActivity() {
  const username = "EmmaWichmann";

  try {
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
    if (!reposRes.ok) throw new Error("GitHub API request failed");

    const repos = await reposRes.json();
    const ownRepos = Array.isArray(repos) ? repos.filter((repo) => !repo.fork) : [];

    document.querySelectorAll("[data-repo]").forEach((card) => {
      const repo = ownRepos.find(
        (r) => r.name.toLowerCase() === card.getAttribute("data-repo").toLowerCase()
      );
      if (!repo) return;

      const starsEl = card.querySelector(".meta-stars");
      const updatedEl = card.querySelector(".meta-updated");
      if (starsEl) starsEl.textContent = `★ ${repo.stargazers_count}`;
      if (updatedEl) {
        const updated = new Date(repo.pushed_at);
        updatedEl.textContent = `Updated ${updated.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}`;
      }
    });

    const mostRecentPush = ownRepos
      .map((repo) => new Date(repo.pushed_at))
      .sort((a, b) => b - a)[0];
    updateGardenStatus(mostRecentPush);
  } catch (err) {
    console.warn("Project activity unavailable:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadProjectActivity);
