const storageKey = "eventflow_pending_teams";

const seedData = [
  {
    id: "team-1",
    name: "Hackathon Heroes",
    captain: "Priya S.",
    members: 5,
    status: "pending",
    notes: "2 submitted project drafts",
  },
  {
    id: "team-2",
    name: "Code Crusaders",
    captain: "Arjun K.",
    members: 3,
    status: "pending",
    notes: "1 submitted project draft",
  },
];

function getPendingTeams() {
  const raw = localStorage.getItem(storageKey);
  if (!raw) {
    localStorage.setItem(storageKey, JSON.stringify(seedData));
    return seedData;
  }
  return JSON.parse(raw);
}

function savePendingTeams(teams) {
  localStorage.setItem(storageKey, JSON.stringify(teams));
}

function updateStats() {
  const teams = getPendingTeams();
  const participants = teams.reduce((sum, t) => sum + t.members, 0);
  document.getElementById("statParticipants").textContent = participants;
  document.getElementById("statTeams").textContent = teams.length;
  document.getElementById("statSessions").textContent = 5; // example static value
}

function renderPendingTeams() {
  const container = document.getElementById("pendingTeams");
  if (!container) return;

  const filter = document
    .getElementById("teamFilter")
    .value.toLowerCase()
    .trim();

  const teams = getPendingTeams()
    .filter((team) => team.name.toLowerCase().includes(filter));

  if (!teams.length) {
    container.innerHTML = `
      <div class="card" style="text-align:center;">
        <p style="margin:0; color: var(--muted);">No pending teams found.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = teams
    .map(
      (team) => `
      <article class="approval-card">
        <div class="approval-top">
          <div>
            <h3>${team.name}</h3>
            <p class="muted">Captain: ${team.captain}</p>
          </div>
          <span class="badge pending">Pending</span>
        </div>

        <p class="muted">${team.members} members • ${team.notes}</p>

        <div class="approval-actions">
          <button class="btn btn-secondary" onclick="rejectTeam('${team.id}')">
            Reject
          </button>
          <button class="btn btn-primary" onclick="approveTeam('${team.id}')">
            Approve
          </button>
        </div>
      </article>`
    )
    .join("");
}

function approveTeam(id) {
  const updated = getPendingTeams().filter((t) => t.id !== id);
  savePendingTeams(updated);
  renderPendingTeams();
  updateStats();
}

function rejectTeam(id) {
  const updated = getPendingTeams().filter((t) => t.id !== id);
  savePendingTeams(updated);
  renderPendingTeams();
  updateStats();
}

function broadcastAlert() {
  alert("Broadcast sent to all participants.");
}

document.addEventListener("DOMContentLoaded", () => {
  renderPendingTeams();
  updateStats();
  document.getElementById("teamFilter").addEventListener("input", renderPendingTeams);
});