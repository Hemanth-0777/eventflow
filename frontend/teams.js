// Back and Logout buttons
// Back and Logout buttons
document.getElementById('backBtn').addEventListener('click', () => {
  window.location.href = 'welcome.html';
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  window.location.href = 'index.html';
});

// Team registration logic
const form = document.getElementById('teamForm');
const tableBody = document.getElementById('teamTableBody');
const searchInput = document.getElementById('searchTable');

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const teamName = document.getElementById('teamName').value.trim();
  const members = document.getElementById('members').value.trim();
  const captain = document.getElementById('captain').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!teamName || !members || !captain || !email) {
    alert("Please fill in all fields.");
    return;
  }

  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${teamName}</td>
    <td>${members}</td>
    <td>${captain}</td>
    <td>${email}</td>
    <td><span class="badge pending">Pending</span></td>
    <td>
      <div class="action-buttons">
        <button class="btn btn-approve" onclick="approveTeam(this)">Approve</button>
        <button class="btn btn-reject" onclick="rejectTeam(this)">Reject</button>
      </div>
    </td>
  `;
  tableBody.appendChild(row);
  form.reset();
});

searchInput.addEventListener('keyup', function() {
  const filter = searchInput.value.toLowerCase();
  const rows = tableBody.getElementsByTagName('tr');
  Array.from(rows).forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(filter) ? '' : 'none';
  });
});

function approveTeam(button) {
  const row = button.closest('tr');
  const statusCell = row.querySelector('.badge');
  statusCell.textContent = 'Approved';
  statusCell.className = 'badge approved';
}

function rejectTeam(button) {
  const row = button.closest('tr');
  const statusCell = row.querySelector('.badge');
  statusCell.textContent = 'Rejected';
  statusCell.className = 'badge rejected';
}
