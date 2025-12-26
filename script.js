document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("startBtn");

  btn.addEventListener("click", () => {
    alert("Streaming feature coming soon 🚀");
  });
});if (creator) {
  const creatorLink = document.getElementById("creatorName");
  creatorLink.textContent = "@" + creator;
  creatorLink.href = "profile.html?creator=" + creator;
}

