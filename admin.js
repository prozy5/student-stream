import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://iabzmoxzbqzcqgypxctr.supabase.co",
  "https://iabzmoxzbqzcqgypxctr.supabase.co"
);

let currentUserProfile = null;

/* =========================
   AUTH + ROLE CHECK
========================= */

async function initAdmin() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    window.location.href = "/login.html";
    return;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile || !profile.is_admin) {
    alert("Access denied.");
    window.location.href = "/";
    return;
  }

  currentUserProfile = profile;

  if (profile.is_owner) {
    document.getElementById("ownerPanel").style.display = "block";
  }

  loadDashboardStats();
  loadUsers();
  loadListings();
  loadReports();
  loadMessages();
}

document.addEventListener("DOMContentLoaded", initAdmin);

/* =========================
   DASHBOARD
========================= */

async function loadDashboardStats() {
  const users = await supabase.from("profiles").select("id", { count: "exact", head: true });
  const listings = await supabase.from("marketplace_listings").select("id", { count: "exact", head: true });
  const messages = await supabase.from("messages").select("id", { count: "exact", head: true });

  document.getElementById("usersCount").innerText = users.count || 0;
  document.getElementById("listingsCount").innerText = listings.count || 0;
  document.getElementById("messagesCount").innerText = messages.count || 0;
}

/* =========================
   USERS PANEL
========================= */

async function loadUsers() {
  const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });

  const container = document.getElementById("usersList");
  container.innerHTML = "";

  data.forEach(user => {
    const div = document.createElement("div");
    div.className = "admin-row";

    div.innerHTML = `
      <b>${user.username}</b> (${user.id})
      ${user.banned ? "🚫" : ""}
      ${user.is_verified ? "✅" : ""}
      <button onclick="toggleBan('${user.id}', ${user.banned})">Ban</button>
      <button onclick="verifyUser('${user.id}')">Verify</button>
      <button onclick="toggleStaff('${user.id}', ${user.is_staff})">Staff</button>
    `;

    container.appendChild(div);
  });
}

async function toggleBan(id, current) {
  await supabase.from("profiles").update({ banned: !current }).eq("id", id);
  loadUsers();
}

async function verifyUser(id) {
  await supabase.from("profiles").update({ is_verified: true }).eq("id", id);
  loadUsers();
}

async function toggleStaff(id, current) {
  await supabase.from("profiles").update({ is_staff: !current }).eq("id", id);
  loadUsers();
}

/* =========================
   MARKETPLACE PANEL
========================= */

async function loadListings() {
  const { data } = await supabase
    .from("marketplace_listings")
    .select("*")
    .order("created_at", { ascending: false });

  const container = document.getElementById("marketplaceList");
  container.innerHTML = "";

  data.forEach(item => {
    const div = document.createElement("div");
    div.className = "admin-row";

    div.innerHTML = `
      <b>${item.title}</b> by ${item.user_id}
      <button onclick="deleteListing('${item.id}')">Delete</button>
    `;

    container.appendChild(div);
  });
}

async function deleteListing(id) {
  if (!confirm("Delete this listing?")) return;

  await supabase.from("marketplace_listings").delete().eq("id", id);
  loadListings();
}

/* =========================
   REPORTS PANEL
========================= */

async function loadReports() {
  const { data } = await supabase
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });

  const container = document.getElementById("reportsList");
  container.innerHTML = "";

  data.forEach(r => {
    const div = document.createElement("div");
    div.className = "admin-row";

    div.innerHTML = `
      <b>${r.type}</b> → ${r.target_id}
      <p>${r.reason}</p>
      <button onclick="resolveReport('${r.id}')">Resolve</button>
    `;

    container.appendChild(div);
  });
}

async function resolveReport(id) {
  await supabase.from("reports").update({ resolved: true }).eq("id", id);
  loadReports();
}

/* =========================
   MESSAGES PANEL
========================= */

async function loadMessages() {
  const { data } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  const container = document.getElementById("messagesList");
  container.innerHTML = "";

  data.forEach(msg => {
    const div = document.createElement("div");
    div.className = "admin-row";

    div.innerHTML = `
      <b>${msg.sender_id}</b> → ${msg.receiver_id}
      <p>${msg.content}</p>
    `;

    container.appendChild(div);
  });
}

/* =========================
   OWNER PANEL (LOCKED)
========================= */

async function ownerLogin(password) {
  if (!currentUserProfile.is_owner) {
    alert("Owner only.");
    return;
  }

  if (password !== "CHANGE_THIS_PASSWORD") {
    alert("Wrong password");
    return;
  }

  document.getElementById("ownerPanelContent").style.display = "block";
}

/* =========================
   LOGOUT
========================= */

async function logout() {
  await supabase.auth.signOut();
  window.location.href = "/login.html";
}

/* =========================
   GLOBAL EXPORTS
========================= */

window.toggleBan = toggleBan;
window.verifyUser = verifyUser;
window.toggleStaff = toggleStaff;
window.deleteListing = deleteListing;
window.resolveReport = resolveReport;
window.ownerLogin = ownerLogin;
window.logout = logout;