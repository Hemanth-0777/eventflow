let currentTeam = [];

function addMember() {
    const emailInput = document.getElementById('inviteEmail');
    const email = emailInput.value.trim();

    if (email && email.includes('@')) {
        currentTeam.push(email);
        renderRoster(email);
        emailInput.value = '';
        console.log(`Mock Notification: Invite sent to ${email}`);
    } else {
        alert("Enter a valid email!");
    }
}

function renderRoster(email) {
    const list = document.getElementById('memberList');
    const div = document.createElement('div');
    div.className = 'member-item';
    div.innerHTML = `
        <img src="https://ui-avatars.com/api/?name=${email}&background=6366f1&color=fff" alt="Avatar">
        <div><strong>${email.split('@')[0]}</strong><p>Pending...</p></div>
        <span class="badge" style="background:var(--warning)">Invited</span>`;
    list.appendChild(div);
}

async function saveTeam() {
    const name = document.getElementById('teamNameInput').value;
    if(!name) return alert("Please name your team!");

    try {
        const res = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ teamName: name, members: currentTeam })
        });
        const data = await res.json();
        alert(data.message);
    } catch (err) { alert("Server Offline. Check Backend."); }
}