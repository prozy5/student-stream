const SUPABASE_URL = "https://iabzmoxzbqzcqgypxctr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhYnptb3h6YnF6Y3FneXB4Y3RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDgzNzAsImV4cCI6MjA4MjY4NDM3MH0.mHke56jh8WSlzzQxa7o2PIxqLRk1eyPRZerJ3avuGkQ";

const supabase = supabaseJs.createClient(SUPABASE_URL, SUPABASE_KEY);

// TEMP user (until auth system)
const CURRENT_USER_ID = "0801d47e-6bc7-4916-bf0a-e2de667d21ea";
const CURRENT_USERNAME = "StudentStream";

document.getElementById("postBtn").addEventListener("click", createThread);

async function createThread() {
const title = document.getElementById("title").value.trim();
const content = document.getElementById("content").value.trim();
const category = document.getElementById("category").value;
const status = document.getElementById("status");

if (!title || !content) {
status.textContent = "Fill in all fields.";
return;
}

status.textContent = "Posting...";

const { error } = await supabase.from("forum_posts").insert([{
title,
content,
category,
user_id: CURRENT_USER_ID,
username: CURRENT_USERNAME,
created_at: new Date().toISOString()
}]);

if (error) {
console.error(error);
status.textContent = "Failed: " + error.message;
return;
}

status.textContent = "Posted successfully! Redirecting...";

setTimeout(() => {
window.location.href = "index.html";
}, 700);
}
