const goLiveBtn = document.getElementById("goLiveBtn");

goLiveBtn.addEventListener("click", () => {
  const title = document.getElementById("streamTitle").value;
  const category = document.getElementById("category").value;

  if (!title) {
    alert("Enter a stream title");
    return;
  }

  const stream = {
    creator: "alex",
    title,
    category,
    live: true
  };

  localStorage.setItem("liveStream", JSON.stringify(stream));

  alert("You are live!");
  window.location.href = "index.html";
});
