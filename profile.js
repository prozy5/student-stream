const params = new URLSearchParams(window.location.search);
const creator = params.get("creator");

const followKey = "follow_" + creator;
const countKey = "followers_" + creator;

let isFollowing = localStorage.getItem(followKey) === "true";
let followerCount = parseInt(localStorage.getItem(countKey)) || 120;

document.getElementById("profileName").textContent = "@" + creator;
updateUI();

function follow() {
  if (isFollowing) {
    followerCount--;
    isFollowing = false;
  } else {
    followerCount++;
    isFollowing = true;
  }

  localStorage.setItem(followKey, isFollowing);
  localStorage.setItem(countKey, followerCount);
  updateUI();
}

function updateUI() {
  document.getElementById("followers").textContent =
    followerCount + " followers";

  document.querySelector("button").textContent =
    isFollowing ? "Following" : "Follow";
}

