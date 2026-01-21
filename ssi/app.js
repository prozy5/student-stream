window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").style.display = "none";
    document.getElementById("site").classList.remove("hidden");
  }, 1500); // 1.5 second intro
});