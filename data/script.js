/**
 * script.js.example
 *
 * Copy to script.js once firebaseConfig.js is configured.
 * This file contains:
 *  - Tab navigation logic
 *  - Fetching locker status from ESP32
 *  - Lock/Unlock and password-change controls
 *  - Fetching and rendering logs from Firebase
 */

// --- TAB LOGIC ---
const statusTab   = document.getElementById('statusTab');
const controlTab  = document.getElementById('controlTab');
const logsTab     = document.getElementById('logsTab');
const statusPage  = document.getElementById('statusPage');
const controlPage = document.getElementById('controlPage');
const logsPage    = document.getElementById('logsPage');
const resultEl    = document.getElementById('action-result');

statusTab.onclick   = () => showTab('status');
controlTab.onclick  = () => showTab('control');
logsTab.onclick     = () => showTab('logs');

function showTab(tab) {
  statusPage.style.display   = tab === 'status'  ? '' : 'none';
  controlPage.style.display  = tab === 'control' ? '' : 'none';
  logsPage.style.display     = tab === 'logs'    ? '' : 'none';
  [statusTab, controlTab, logsTab].forEach(b => b.classList.remove('active'));
  document.getElementById(tab + 'Tab').classList.add('active');
  if (tab === 'status') fetchStatus();
  if (tab === 'logs')   fetchLogs();
}

// --- STATUS FROM ESP32 ---
function fetchStatus() {
  fetch('/status')
    .then(res => res.json())
    .then(data => {
      document.getElementById('locker-status').textContent =
        data.empty ? 'Occupied' : 'Empty';
    })
    .catch(() => {
      document.getElementById('locker-status').textContent = 'Error';
    });
}

// --- LOCK/UNLOCK CONTROL ---
function doControl(action) {
  const pwd = encodeURIComponent(document.getElementById('pwd').value);
  fetch(`/control?state=${action}&pwd=${pwd}`)
    .then(res => res.text())
    .then(msg => {
      resultEl.textContent = msg;
      document.getElementById('pwd').value = '';
    })
    .catch(err => {
      resultEl.textContent = 'Error: ' + err.message;
    });
}

function setPassword() {
  const np = encodeURIComponent(document.getElementById('newPwd').value);
  fetch(`/setPassword?pwd=${np}`)
    .then(res => res.text())
    .then(msg => {
      resultEl.textContent = msg;
      document.getElementById('newPwd').value = '';
    })
    .catch(err => {
      resultEl.textContent = 'Error: ' + err.message;
    });
}

// --- FIREBASE LOGS ---
// Assumes firebaseConfig.js has initialized `firebase.app()`
const db = firebase.database();

function fetchLogs() {
  db.ref('locker/logs').once('value', snap => {
    const obj = snap.val() || {};
    const entries = [];

    // Merge web & rfid logs
    if (obj.web)  Object.values(obj.web).forEach(l => entries.push(l));
    if (obj.rfid) Object.values(obj.rfid).forEach(l => entries.push(l));

    // Sort by timestamp descending
    entries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    renderLogs(entries);
  });
}

function renderLogs(entries) {
  const table  = document.getElementById('logsTable');
  const filter = document.getElementById('logFilter').value;
  table.innerHTML = '';

  if (!entries.length) {
    const row = document.createElement('tr');
    row.innerHTML = `<td colspan="5">No logs found.</td>`;
    table.appendChild(row);
    return;
  }

  entries.forEach(log => {
    if (filter !== 'All' && log.method !== filter) return;
    const r = document.createElement('tr');
    r.innerHTML = `
      <td>${log.timestamp}</td>
      <td>${log.method}</td>
      <td>${log.action}</td>
      <td>${log.success === "true" ? "Yes" : "No"}</td>
      <td>${log.message}</td>
    `;
    table.appendChild(r);
  });
}

// Real‑time updates on new entries
db.ref('locker/logs/web').limitToLast(1)
  .on('child_added', fetchLogs);
db.ref('locker/logs/rfid').limitToLast(1)
  .on('child_added', fetchLogs);

// Re-fetch when filter changes
document.getElementById('logFilter').onchange = fetchLogs;

// Initialize view
showTab('status');
