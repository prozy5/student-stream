const supabase = supabase.createClient("URL","KEY");
const threadsDiv = document.getElementById("threads");

async function loadThreads(){
  const {data} = await supabase
    .from("forum_posts")
    .select("id,title,created_at,profiles(username,role)")
    .order("created_at",{ascending:false});

  threadsDiv.innerHTML="";

  data.forEach(t=>{
    const role = t.profiles?.role || "user";
    threadsDiv.innerHTML += `
      <div class="thread-card" onclick="openThread('${t.id}')">
        <div>
          <b>${t.title}</b>
          <div class="meta">${t.profiles?.username || "anon"} 
          <span class="badge ${role}">${role}</span></div>
        </div>
        <div class="meta">${new Date(t.created_at).toLocaleDateString()}</div>
      </div>
    `;
  });
}

function openThread(id){
  location.href = `thread.html?id=${id}`;
}

supabase.channel("forum")
.on("postgres_changes",{event:"INSERT",schema:"public",table:"forum_posts"},loadThreads)
.subscribe();

loadThreads();