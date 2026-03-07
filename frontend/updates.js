// updates.js
const mockUpdates = [
    { time: "10:00 AM", title: "Hackathon Kickoff!", desc: "The opening ceremony has begun in the main hall." },
    { time: "12:30 PM", title: "Lunch is Served", desc: "Head to the cafeteria for pizzas and drinks." },
    { time: "02:00 PM", title: "Workshop: Node.js", desc: "Join us in Room B for a deep dive into backend scaling." }
];

function loadUpdates() {
    const feed = document.getElementById('updates-feed');
    feed.innerHTML = mockUpdates.map(u => `
        <div class="update-item">
            <span class="timestamp">${u.time}</span>
            <h3>${u.title}</h3>
            <p>${u.desc}</p>
        </div>
    `).reverse().join(''); // Show newest first
}

// Simple Digital Clock
function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString();
}

setInterval(updateClock, 1000);
loadUpdates();

// Simulate a new update coming in after 5 seconds
setTimeout(() => {
    mockUpdates.push({ time: "05:00 PM", title: "⚠️ 1 Hour Reminder", desc: "One hour left for the UI/UX checkpoint!" });
    loadUpdates();
}, 5000);