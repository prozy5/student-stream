let page=0;
const PAGE=6;

async function loadCases(){
  const q=document.getElementById("search").value;

  let query=supabase.from("cases")
    .select("*")
    .order("created_at",{ascending:false})
    .range(page*PAGE,page*PAGE+PAGE-1);

  if(q) query=query.ilike("title",`%${q}%`);

  const {data}=await query;

  const el=document.getElementById("cases");
  el.innerHTML="";

  data.forEach(c=>{
    const d=document.createElement("div");
    d.className="card";
    d.onclick=()=>location=`case.html?id=${c.id}`;
    d.innerHTML=`<h3>${c.title}</h3><p>${c.description||""}</p>`;
    el.appendChild(d);
  });
}

async function loadVideos(){
  const {data}=await supabase.from("videos").select("*").limit(6);

  const el=document.getElementById("videos");
  el.innerHTML="";

  data.forEach(v=>{
    const d=document.createElement("div");
    d.className="card";
    d.innerHTML=`<h3>${v.title}</h3><video src="${v.url}" controls></video>`;
    el.appendChild(d);
  });
}

function nextPage(){page++;loadCases();}
function prevPage(){if(page>0){page--;loadCases();}}
function reload(){page=0;loadCases();}

loadCases();
loadVideos();