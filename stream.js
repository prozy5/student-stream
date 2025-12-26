const params = new URLSearchParams(window.location.search);
const title = params.get("title");
const creator = params.get("creator");

if (title) {
  document.getElementById("streamTitle").textContent = title;
}

if (creator) {
  const creatorLink = document.getElementById("creatorName");
  creatorLink.textContent = "@" + creator;
  creatorLink.href = "profile.html?creator=" + creator;
}
