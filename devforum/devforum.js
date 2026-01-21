// devforum.js

const SUPABASE_URL = "https://iabzmoxzbqzcqgypxctr.supabase.co";
const SUPABASE_KEY = "PASTE_YOUR_REAL_ANON_KEY_HERE";

const supabase = supabaseJs.createClient(SUPABASE_URL, SUPABASE_KEY);

// Elements
const threadsContainer = document.getElementById("threads");
const form = document.getElementById("newThreadForm");
const titleInput = document.getElementById("threadTitle");
const contentInput = document.getElementById("threadContent");
const statusText = document.getElementById("statusText");

// Utility
function setStatus(msg) {
  if (statusText) statusText.textContent = msg;
}

// Load threads
async function loadThreads() {
  setStatus("Loading threads...");

  const { data, error } = await supabase
    .from("forum_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    setStatus("Failed to load threads");
    return;
  }

  threadsContainer.innerHTML = "";

  if (data.length === 0) {
    threadsContainer.innerHTML = "<p>No threads yet.</p>";
    setStatus("Ready");
    return;
  }

  data.forEach(thread => {
    const div = document.createElement("div");
    div.className = "thread-card";

    div.innerHTML = `
      <h3>${escapeHtml(thread.title)}</h3>
      <p>${escapeHtml(thread.content)}</p>
      <span class="thread-date">${new Date(thread.created_at).toLocaleString()}</span>
    `;

    div.onclick = () => {
      window.location.href = `thread.html?id=${thread.id}`;
    };

    threadsContainer.appendChild(div);
  });

  setStatus("Ready");
}

// Post new thread
async function createThread(e) {
  e.preventDefault();

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) return;

  setStatus("Posting...");

  const { error } = await supabase.from("forum_posts").insert([
    { title, content }
  ]);

  if (error) {
    console.error(error);
    alert("Failed to post thread");
    setStatus("Error");
    return;
  }

  titleInput.value = "";
  contentInput.value = "";

  setStatus("Posted!");
  loadThreads();
}

// Realtime updates
function enableRealtime() {
  supabase
    .channel("forum_posts_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "forum_posts" },
      () => loadThreads()
    )
    .subscribe();
}

// XSS protection
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Init
if (form) {
  form.addEventListener("submit", createThread);
}

loadThreads();
enableRealtime();