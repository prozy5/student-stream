// ==========================
// SUPABASE SETUP
// ==========================

const SUPABASE_URL = "https://iabzmoxzbqzcqgypxctr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhYnptb3h6YnF6Y3FneXB4Y3RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDgzNzAsImV4cCI6MjA4MjY4NDM3MH0.mHke56jh8WSlzzQxa7o2PIxqLRk1eyPRZerJ3avuGkQ";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ==========================
// LOAD VIDEOS
// ==========================

async function loadVideos() {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .order("created_at", { ascending: false });

  const container = document.getElementById("videos");
  container.innerHTML = "";

  if (error) {
    container.innerHTML = "<p>Error loading investigations.</p>";
    return;
  }

  if (data.length === 0) {
    container.innerHTML = "<p>No investigations published yet.</p>";
    return;
  }

  data.forEach(video => {
    const div = document.createElement("div");
    div.className = "video";

    div.innerHTML = `
      <h3>${video.title}</h3>
      <video controls src="${video.video_url}"></video>
      <p>${video.description}</p>

      <button onclick="likeVideo('${video.id}')">❤️ Like</button>

      <div class="comment-box" id="comments-${video.id}">
        <p>Loading comments...</p>
      </div>

      <input id="name-${video.id}" placeholder="Your name">
      <input id="comment-${video.id}" placeholder="Your comment">
      <button onclick="postComment('${video.id}')">Post Comment</button>
    `;

    container.appendChild(div);

    loadComments(video.id);
  });
}

// ==========================
// LIKE SYSTEM
// ==========================

async function likeVideo(videoId) {
  await supabase.from("likes").insert([
    { video_id: videoId }
  ]);

  alert("Liked.");
}

// ==========================
// COMMENTS SYSTEM
// ==========================

async function postComment(videoId) {
  const name = document.getElementById(`name-${videoId}`).value.trim();
  const comment = document.getElementById(`comment-${videoId}`).value.trim();

  if (!name || !comment) {
    alert("Enter name and comment.");
    return;
  }

  await supabase.from("comments").insert([
    { video_id: videoId, username: name, comment: comment }
  ]);

  document.getElementById(`comment-${videoId}`).value = "";

  loadComments(videoId);
}

async function loadComments(videoId) {
  const { data } = await supabase
    .from("comments")
    .select("*")
    .eq("video_id", videoId)
    .order("created_at", { ascending: false });

  const box = document.getElementById(`comments-${videoId}`);

  if (!data || data.length === 0) {
    box.innerHTML = "<p>No comments yet.</p>";
    return;
  }

  box.innerHTML = data
    .map(c => `<p><b>${c.username}:</b> ${c.comment}</p>`)
    .join("");
}

// ==========================
// ADMIN UPLOAD (for admin.html)
// ==========================

async function uploadVideo() {
  const title = document.getElementById("title").value;
  const desc = document.getElementById("desc").value;
  const url = document.getElementById("video").value;

  if (!title || !url) {
    alert("Missing fields.");
    return;
  }

  await supabase.from("videos").insert([
    { title: title, description: desc, video_url: url }
  ]);

  alert("Investigation uploaded.");

  document.getElementById("title").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("video").value = "";
}

// ==========================
// INIT
// ==========================

document.addEventListener("DOMContentLoaded", loadVideos);
console.log("SS:I system loaded");