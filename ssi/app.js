const SUPABASE_URL = "https://iabzmoxzbqzcqgypxctr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhYnptb3h6YnF6Y3FneXB4Y3RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDgzNzAsImV4cCI6MjA4MjY4NDM3MH0.mHke56jh8WSlzzQxa7o2PIxqLRk1eyPRZerJ3avuGkQ";

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json"
};

window.onload = () => {
  setTimeout(() => {
    document.getElementById("loader").style.display = "none";
    document.getElementById("app").classList.remove("hidden");
    loadVideos();
  }, 2500);
};

async function uploadVideo() {
  const title = document.getElementById("videoTitle").value;
  const file = document.getElementById("videoFile").files[0];

  if (!title || !file) return alert("Missing info");

  const fileName = Date.now() + "_" + file.name;

  await fetch(`${SUPABASE_URL}/storage/v1/object/videos/${fileName}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": file.type
    },
    body: file
  });

  const url = `${SUPABASE_URL}/storage/v1/object/public/videos/${fileName}`;

  await fetch(`${SUPABASE_URL}/rest/v1/videos`, {
    method: "POST",
    headers,
    body: JSON.stringify({ title, url })
  });

  loadVideos();
}

async function loadVideos() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/videos?select=*`, { headers });
  const data = await res.json();

  const feed = document.getElementById("feed");
  feed.innerHTML = "";

  data.reverse().forEach(v => {
    const div = document.createElement("div");
    div.className = "video-card";
    div.innerHTML = `
      <h3>${v.title}</h3>
      <video src="${v.url}" controls width="100%"></video>
    `;
    feed.appendChild(div);
  });
}

async function createCase() {
  const title = document.getElementById("caseTitle").value;
  const description = document.getElementById("caseDesc").value;

  if (!title || !description) return alert("Missing case info");

  await fetch(`${SUPABASE_URL}/rest/v1/cases`, {
    method: "POST",
    headers,
    body: JSON.stringify({ title, description })
  });

  alert("Case created.");
}
