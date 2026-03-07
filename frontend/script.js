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
  }
});