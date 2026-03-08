const API_BASE = 'http://localhost:3000/api';
const storageKey = "eventflow_events";

// 1. Fetch and Display Events
async function loadDashboard() {
    try {
        const res = await fetch(`${API_BASE}/events`);
        const events = await res.json();
        
        const liveGrid = document.getElementById('live-container');
        const eventList = document.getElementById('event-list');

        if (!liveGrid || !eventList) return;

        liveGrid.innerHTML = '';
        eventList.innerHTML = '';

        events.forEach(event => {
            const html = `
                <div class="event-card">
                    <span class="badge ${event.type === 'Live' ? 'pulse' : ''}">${event.type}</span>
                    <h3>${event.title}</h3>
                    <p>📍 ${event.venue} | 📅 ${event.date}</p>
                    <button class="btn-primary full-width" onclick="location.href='teams.html'">Join Event</button>
                </div>`;
            
            if(event.type === 'Live') liveGrid.innerHTML += html;
            else eventList.innerHTML += html;
        });
    } catch (err) { console.error("Error loading events:", err); }
}

// 2. Simple Clock for "War Room" feel
function updateClock() {
    const clock = document.getElementById('clock');
    if(clock) clock.innerText = new Date().toLocaleTimeString();
}

// 3. Open/Create Modal
function openCreateModal() {
    document.getElementById('create-modal').classList.remove('hidden');
}

function closeLiveModal() {
    const modal = document.getElementById('live-modal');
    modal.classList.add('hidden');
}

document.querySelectorAll('.view-live').forEach(btn => {
    btn.addEventListener('click', () => {
        const title = btn.dataset.title;
        const desc = btn.dataset.desc;
        const img = btn.dataset.img;

        openLiveModal({ title, desc, img });
    });
});

// Initial Calls
if(document.getElementById('live-container')) loadDashboard();
setInterval(updateClock, 1000);

function saveEvent(event) {
  const events = JSON.parse(localStorage.getItem(storageKey) || "[]");
  events.unshift(event);
  localStorage.setItem(storageKey, JSON.stringify(events));
}

function loadEvents() {
  const list = document.getElementById("event-list");
  if (!list) return;

  const events = JSON.parse(localStorage.getItem(storageKey) || "[]");
  list.innerHTML =
    events.length === 0
      ? `<div class="card"><p style="margin:0;color:var(--muted)">No events yet. Create one to see it here.</p></div>`
      : events
          .map(
            (ev) => `
      <div class="event-card">
        <h3>${ev.name}</h3>
        <p>${new Date(ev.date).toLocaleString()}</p>
        <p>${ev.desc || ""}</p>
      </div>`
          )
          .join("");
}

function openLiveModal({ title, desc, img }) {
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-desc").textContent = desc;
  document.getElementById("modal-img").src = img;
  document.getElementById("live-modal").classList.remove("hidden");
}

function closeLiveModal() {
  document.getElementById("live-modal").classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  loadEvents();

  document.querySelectorAll(".view-live").forEach((btn) => {
    btn.addEventListener("click", () => {
      openLiveModal({
        title: btn.dataset.title,
        desc: btn.dataset.desc,
        img: btn.dataset.img,
      });
    });
  });

  const form = document.getElementById("create-event-form");
  if (!form) return;

  form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    const name = document.getElementById("event-name").value.trim();
    const date = document.getElementById("event-date").value;
    const desc = document.getElementById("event-desc").value.trim();

    if (!name || !date) return alert("Please add a name and date.");

    saveEvent({ name, date, desc });
    window.location.href = "index.html";
  });

  const nav = document.querySelector("[data-nav]");
  const toggle = document.querySelector(".nav-toggle");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
      toggle.classList.toggle("open");
    });

    nav.querySelectorAll("a").forEach((link) => {
      if (link.href === location.href) link.classList.add("active");
    });
  }

  const searchInput = document.getElementById("searchTable");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const filter = searchInput.value.toLowerCase();
      document.querySelectorAll("#adminTeamBody tr").forEach((row) => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? "" : "none";
      });
    });
  // Display name from login
const currentUser = localStorage.getItem('currentUser');
if (currentUser) {
  document.getElementById('user-greeting').innerText = `Hello, ${currentUser}!`;
}

function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  body.classList.add('light-mode');
  updateIcon(true);
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight = body.classList.toggle('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateIcon(isLight);
  });
}

function updateIcon(isLight) {
  if (!themeIcon) return;
  // Update Lucide icon dynamically
  themeIcon.setAttribute('data-lucide', isLight ? 'moon' : 'sun');
  if (window.lucide) lucide.createIcons(); 
}
const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');
let stars = [];
let warpSpeed = 1; // Base movement speed
let isLaunching = false;

// 1. Setup Canvas and create Star objects
function initStars() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];
    for (let i = 0; i < 300; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            z: Math.random() * canvas.width, // Depth
            size: Math.random() * 2
        });
    }
}

// 2. Animate the Starfield
function animateStars() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "white";
    stars.forEach(s => {
        // Project 3D position to 2D
        let x = (s.x - canvas.width / 2) * (canvas.width / s.z) + canvas.width / 2;
        let y = (s.y - canvas.height / 2) * (canvas.width / s.z) + canvas.height / 2;
        let size = s.size * (canvas.width / s.z);

        // Draw stretched lines if warpSpeed is high
        if (isLaunching) {
            ctx.beginPath();
            ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
            ctx.lineWidth = size;
            ctx.moveTo(x, y);
            ctx.lineTo(x + (warpSpeed * 0.5), y + (warpSpeed * 0.5));
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }

        s.z -= warpSpeed; // Move star closer to viewer
        if (s.z <= 0) s.z = canvas.width; // Reset star to back
    });
    requestAnimationFrame(animateStars);
}

// 3. The Launch Sequence
function launchRockets() {
    const rL = document.querySelector('.rocket-l');
    const rR = document.querySelector('.rocket-r');
    const btn = document.querySelector('.welcome-btn');

    isLaunching = true;
    
    // UI Feedback
    btn.innerText = "LIFTOFF!";
    btn.style.borderColor = "var(--fire)";
    btn.style.boxShadow = "0 0 50px var(--fire)";
    
    // Start shaking
    rL.classList.remove('float');
    rR.classList.remove('float');
    rL.classList.add('shake');
    rR.classList.add('shake');

    // Gradually increase warp speed
    let accel = setInterval(() => {
        warpSpeed += 1.5;
        if (warpSpeed > 50) clearInterval(accel);
    }, 50);

    // Launch!
    setTimeout(() => {
        rL.style.transform = "translate(2000px, -2000px) scale(2)";
        rR.style.transform = "translate(2000px, -2000px) scale(2)";
        
        // Final Redirect to register.html
        setTimeout(() => {
            window.location.href = "register.html";
        }, 800);
    }, 800);
}

// Initialize on load
initStars();
animateStars();
window.addEventListener('resize', initStars);
});