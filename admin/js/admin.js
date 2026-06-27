// admin/js/admin.js — Shaafi Admin Panel v2

const SUPABASE_URL = 'https://usvyesisjcsujrhigjny.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_VUPZUQkPVehrhG3lqh7_EA_07wt3ksq';

const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ========== AUTH ==========
async function checkAuth() {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) { window.location.href = 'index.html'; return null; }
  return session.user;
}

async function logout() {
  await sb.auth.signOut();
  window.location.href = 'index.html';
}

// ========== SIDEBAR ==========
function loadSidebar(activePage) {
  const pages = [
    { name: 'Dashboard', href: 'dashboard.html', icon: 'dashboard' },
    { name: 'Doctors', href: 'doctors.html', icon: 'doctors' },
    { name: 'Patients', href: 'patients.html', icon: 'patients' },
    { name: 'Appointments', href: 'appointments.html', icon: 'appointments' },
    { name: 'Reports', href: 'reports.html', icon: 'reports' },
  ];

  const icons = {
    dashboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
    doctors: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg>`,
    patients: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/><circle cx="17" cy="11" r="3"/><path d="M17 14v4m-2-2h4"/></svg>`,
    appointments: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`,
    reports: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>`,
  };

  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  const links = pages.map(p => `
    <a href="${p.href}" class="sidebar-link ${activePage === p.name ? 'active' : ''}">
      ${icons[p.icon]}
      <span>${p.name}</span>
    </a>
  `).join('');

  sidebar.innerHTML = `
    <div class="sidebar-brand">
      <div class="icon">🏥</div>
      <span>Shaafi Admin</span>
    </div>
    <div class="sidebar-nav">
      ${links}
    </div>
    <div class="sidebar-footer">
      <button class="sidebar-logout" onclick="logout()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
        <span>Log Out</span>
      </button>
    </div>
  `;
}

// ========== UTILS ==========
function formatCurrency(amount) {
  return '$' + (amount || 0).toLocaleString();
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function statusBadge(status) {
  const map = {
    confirmed: 'badge-success', pending: 'badge-warning', cancelled: 'badge-danger',
    approved: 'badge-success', rejected: 'badge-danger',
  };
  const labels = { confirmed: 'Confirmed', pending: 'Pending', cancelled: 'Cancelled', approved: 'Approved', rejected: 'Rejected' };
  return `<span class="badge ${map[status] || 'badge-warning'}">${labels[status] || status}</span>`;
}

function showAlert(message, type = 'error') {
  const container = document.getElementById('alert-container');
  if (!container) return;
  container.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
  setTimeout(() => { if (container) container.innerHTML = ''; }, 6000);
}