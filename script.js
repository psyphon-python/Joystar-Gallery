// ==========================================
// CONFIGURATION: Easily add more images here!
// ==========================================
// Just change this number to match how many webp files you have (e.g. 6, 7, etc.)
const totalImages = 5; 
const imageFolderPath = "assets/"; // Folder path where your webp files live

// State for UI sounds
let soundEnabled = true;

// Web Audio API Synthesizer for Wii U Style UI Clicks & Chirps
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
  if (!soundEnabled) return;
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  if (type === 'hover') {
    // Soft high-pitch blip
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    gainNode.gain.setValueAtTime(0.02, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.start(now);
    osc.stop(now + 0.05);
  } else if (type === 'click') {
    // Satisfying console confirmation bleep
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);    // A4
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.1); // A5
    gainNode.gain.setValueAtTime(0.05, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.start(now);
    osc.stop(now + 0.12);
  }
}

// Dynamically generate grid tiles based on totalImages count
document.addEventListener("DOMContentLoaded", () => {
  const gridContainer = document.getElementById("gallery-grid");

  for (let i = 1; i <= totalImages; i++) {
    const tile = document.createElement("div");
    tile.className = "wiiu-tile";
    tile.setAttribute("tabindex", "0");

    const imgPath = `${imageFolderPath}manga${i}.webp`;
    const altText = `Manga Art ${i}`;

    tile.innerHTML = `
      <img src="${imgPath}" alt="${altText}" loading="lazy" />
      <span class="tile-label">Art ${i}</span>
    `;

    // Event listeners for hover and click sounds/actions
    tile.addEventListener("mouseenter", () => playSound('hover'));
    tile.addEventListener("click", () => {
      playSound('click');
      openLightbox(imgPath, altText);
    });

    gridContainer.appendChild(tile);
  }

  // Update clock in the top bar
  updateClock();
  setInterval(updateClock, 1000);

  // Sound toggle button setup
  const soundToggleBtn = document.getElementById("sound-toggle");
  soundToggleBtn.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    soundToggleBtn.textContent = soundEnabled ? "🔊 Sound: ON" : "🔇 Sound: OFF";
    playSound('click');
  });

  // Lightbox close handlers
  const lightbox = document.getElementById("lightbox");
  const closeBtn = document.getElementById("lightbox-close");

  closeBtn.addEventListener("click", () => {
    playSound('click');
    lightbox.style.display = "none";
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.style.display = "none";
    }
  });
});

function openLightbox(src, captionText) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");

  lightboxImg.src = src;
  lightboxCaption.textContent = captionText;
  lightbox.style.display = "flex";
}

function updateClock() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const timeString = `${hours}:${minutes}`;
  const clockEl = document.getElementById("system-time");
  if (clockEl) {
    clockEl.textContent = timeString;
  }
}