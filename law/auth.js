const LAW_USER = "admin";
const LAW_PASS = "studentstreamlaw";

function login(){
  const u = document.getElementById("user").value;
  const p = document.getElementById("pass").value;

  if(u === LAW_USER && p === LAW_PASS){
    localStorage.setItem("law_auth","true");
    location.href = "law-dashboard.html";
  } else {
    document.getElementById("msg").innerText = "Invalid login";
  }
}

function protect(){
  if(localStorage.getItem("law_auth") !== "true"){
    location.href = "law-login.html";
  }
}

function logout(){
  localStorage.removeItem("law_auth");
  location.href = "law-login.html";
}