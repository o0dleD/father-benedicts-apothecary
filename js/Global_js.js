/* ---- Overlay & Popups ---- */
function closeOverlay() {
  const overlay = document.getElementById("introOverlay");
  overlay.style.display = "none";

  const audio = document.getElementById("background-audio");
  audio.volume = 0;
  audio.loop = true;
  audio.muted = false;
  audio.play().then(() => fadeAudio(audio, 0.3, 3000))
             .catch(err => console.log("Audio play prevented:", err));
}

function fadeAudio(audioElement, targetVolume = 0.3, duration = 3000) {
  const steps = 30; let i = 0;
  const interval = setInterval(() => {
    i++; audioElement.volume = Math.min((targetVolume / steps) * i, targetVolume);
    if (i >= steps) clearInterval(interval);
  }, duration / steps);
}

/* ---- Popups ---- */
function openPopup(id) {
  const popup = document.getElementById(id);
  popup.style.display = "block";
  setTimeout(() => popup.classList.add("show"), 10);
}

function showPopup(id, hotspotElement) {
  document.querySelectorAll(".hotspot").forEach(h => h.classList.remove("selected"));
  if (hotspotElement) hotspotElement.classList.add("selected");

  const current = document.querySelector(".popup.show");
  if (current) {
    current.classList.remove("show");
    setTimeout(() => { 
      current.style.display = "none"; 
      openPopup(id); 
    }, 400);
  } else {
    openPopup(id);
  }
}

function closePopup(id) {
  const popup = document.getElementById(id);
  popup.classList.remove("show");
  setTimeout(() => popup.style.display = "none", 400);
  document.querySelectorAll(".hotspot").forEach(h => h.classList.remove("selected"));
}

/* ---- Nav ribbon & page fade ---- */
document.querySelectorAll('.nav-ribbon a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    fadeOutPage(link.getAttribute('href'));
  });
});

function fadeOutPage(url) {
  document.body.classList.add("fade-out");
  setTimeout(() => window.location.href = url, 800);
}

/* ---- Page load fade ---- */
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

/* ---- Dynamic overlay scroll height ---- */
function adjustIntroOverlayHeight() {
  const overlayScroll = document.querySelector('#introOverlay .scroll');
  if (overlayScroll) {
    const ribbon = document.querySelector('.nav-ribbon');
    const ribbonHeight = ribbon ? ribbon.offsetHeight : 48;
    const safeInset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-top)')) || 0;
    overlayScroll.style.maxHeight = `${window.innerHeight - ribbonHeight - safeInset - 20}px`;
  }
}

// Adjust on load and resize/orientation change
window.addEventListener('load', adjustIntroOverlayHeight);
window.addEventListener('resize', adjustIntroOverlayHeight);

/* ---- Landscape phone opening popup fix ---- */
function showLandscapeOpeningPopup() {
  // Only on landscape phones
  const isLandscapePhone = window.matchMedia("(orientation: landscape) and (max-width: 1023px)").matches;
  if (!isLandscapePhone) return;

  const overlay = document.getElementById("introOverlay");
  const popup = overlay.querySelector(".popup");
  if (!popup) return;

  // Hide popup initially
  popup.style.display = "none";
  popup.classList.remove("show");

  // Attach close button listener once
  const closeBtn = popup.querySelector(".close-btn");
  if (closeBtn && !closeBtn.dataset.listenerAttached) {
    closeBtn.addEventListener("click", () => {
      popup.classList.remove("show");
      setTimeout(() => { popup.style.display = "none"; }, 400);
    });
    closeBtn.dataset.listenerAttached = "true";
  }

  // Show popup
  popup.style.display = "block";
  setTimeout(() => popup.classList.add("show"), 10);
}

// Run on load and orientation change
window.addEventListener("load", showLandscapeOpeningPopup);
window.addEventListener("orientationchange", showLandscapeOpeningPopup);