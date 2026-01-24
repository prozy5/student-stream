const SUPABASE_URL = "https://iabzmoxzbqzcqgypxctr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhYnptb3h6YnF6Y3FneXB4Y3RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDgzNzAsImV4cCI6MjA4MjY4NDM3MH0.mHke56jh8WSlzzQxa7o2PIxqLRk1eyPRZerJ3avuGkQ";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// login
async function loginLaw() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    document.getElementById("error").innerText = error.message;
    return;
  }

  window.location.href = "/law/dashboard.html";
}

// logout
async function logoutLaw() {
  await supabase.auth.signOut();
  window.location.href = "/law/login.html";
}

// protect page
async function protectLawPage() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    window.location.href = "/law/login.html";
    return;
  }

  const { data } = await supabase
    .from("law_staff")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!data) {
    alert("Not authorized");
    window.location.href = "/";
  }

  document.getElementById("role").innerText = data.role;
}

// load reports
async function loadReports() {
  const { data } = await supabase.from("law_reports").select("*").order("created_at", { ascending: false });

  const box = document.getElementById("reports");
  box.innerHTML = "";

  data.forEach(r => {
    box.innerHTML += `
      <div class="card">
        <b>${r.subject}</b><br>
        ${r.description}<br>
        <small>${r.status}</small>
      </div>
    `;
  });
}