const id=new URLSearchParams(location.search).get("id");

async function loadCase(){
 const {data}=await supabase.from("cases").select("*").eq("id",id).single();
 caseBox.innerHTML=`<h1>${data.title}</h1><p>${data.description}</p>`;
}

async function loadComments(){
 const {data}=await supabase.from("comments").select("*").eq("case_id",id);
 comments.innerHTML=data.map(c=>`<p>${c.content}</p>`).join("");
}

async function postComment(){
 await supabase.from("comments").insert({case_id:id,content:commentText.value});
 commentText.value="";
 loadComments();
}

async function like(){
 await supabase.from("likes").insert({case_id:id});
 alert("Liked");
}

loadCase();
loadComments();