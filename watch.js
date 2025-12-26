const params = new URLSearchParams(window.location.search);
const creator = params.get("creator") || "creator";
const title = params.get("title") || "Live Stream";

document.getElementById("streamTitle").textContent = title;

const creatorLink = document.getElementById("creatorLink");
creatorLink.textContent = "@" + creator;
creatorLink.href = "profile.html?creator=" + creator;

const viewers = Math.floor(Math.random() * 900) + 50;
document.getElementById("viewerCount").textContent =
  `👀 ${viewers} watching`;

const chatBox = document.getElementById("chatBox");
const messages = [
  "First 🔥",
  "This stream is chill",
  "W study vibes",
  "What language are you coding?",
  "Bro locked in fr"
];

setInterval(() => {
  const msg = document.createElement("p");
  msg.textContent =
    messages[Math.floor(Math.random() * messages.length)];
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}, 3000);
