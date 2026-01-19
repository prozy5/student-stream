const SUPABASE_URL = "https://iabzmoxzbqzcqgypxctr.supabase.co";
const SUPABASE_KEY = "https://iabzmoxzbqzcqgypxctr.supabase.co";

const supabase = supabaseJs.createClient(SUPABASE_URL, SUPABASE_KEY);

let currentAdmin = null;
let ownerUnlocked = false;
const OWNER_PASSWORD = "ChangeThis123!";

async function init() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return location.href = "admin-login.html";

  const { data: admin } = await supabase
    .from("admin_users")
    .select("*")
    .eq("user_id", data.user.id)
    .single();

  if (!admin) {
    alert("Not admin");
    location.href = "/";
    return;
  }

  currentAdmin = admin;
  loadDashboard();
}

function showSection(id) {
  document.querySelectorAll("section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");

  if (id === "users") loadUsers();
  if (id === "listings") loadListings();
  if (id === "reports") loadReports();
  if (id === "messages") loadMessages();
  if (id === "staff") loadStaff();
}

async function loadDashboard() {
  const u = await supabase.from("profiles").select("id", { count: "exact" });
  const l = await supabase.from("marketplace_listings").select("id", { count: "exact" });
  const m = await supabase.from("messages").select("id", { count: "exact" });

  usersCount.innerText = u.count;
  listingsCount.innerText = l.count;
  messagesCount.innerText = m.count;
}

async function loadUsers() {
  const { data } = await supabase.from("profiles").select("*").limit(50);
  render("usersTable", data);
}

async function loadListings() {
  const { data } = await supabase.from("marketplace_listings").select("*").limit(50);
  render("listingsTable", data);
}

async function loadReports() {
  const { data } = await supabase.from("reports").select("*");
  render("reportsTable", data);
}

async function loadMessages() {
  const { data } = await supabase.from("messages").select("*");
  render("messagesTable", data);
}

async function loadStaff() {
  const { data } = await supabase.from("staff_applications").select("*");
  render("staffTable", data);
}

function render(id, rows) {
  const table = document.getElementById(id);
  table.innerHTML = "";
  rows.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = Object.values(r).map(v => `<td>${v}</td>`).join("");
    table.appendChild(tr);
  });
}

function unlockOwner() {
  const pass = document.getElementById("ownerPass").value;

  if (pass === OWNER_PASSWORD && currentAdmin.role === "owner") {
    ownerUnlocked = true;
    document.getElementById("ownerContent").classList.remove("hidden");
    alert("Unlocked");
  } else {
    alert("Wrong password or not owner");
  }
}

async function loadPlatformSettings() {
  if (!ownerUnlocked) return;
  const { data } = await supabase.from("platform_settings").select("*");
  ownerOutput.textContent = JSON.stringify(data, null, 2);
}

async function loadAdminLogs() {
  if (!ownerUnlocked) return;
  const { data } = await supabase.from("admin_logs").select("*");
  ownerOutput.textContent = JSON.stringify(data, null, 2);
}

async function loadAdmins() {
  if (!ownerUnlocked) return;
  const { data } = await supabase.from("admin_users").select("*");
  ownerOutput.textContent = JSON.stringify(data, null, 2);
}

async function logout() {
  await supabase.auth.signOut();
  location.href = "admin-login.html";
}

init();