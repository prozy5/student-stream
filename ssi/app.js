// Intro
setTimeout(()=>{
  document.getElementById("intro").style.display="none";
  document.getElementById("app").classList.remove("hidden");
},2000);

// Login modal
const modal=document.getElementById("loginModal");
document.getElementById("loginBtn").onclick=()=>modal.classList.remove("hidden");

function closeLogin(){
modal.classList.add("hidden");
}