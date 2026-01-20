const supabase = supabase.createClient(
  "YOUR_URL",
  "YOUR_PUBLIC_KEY"
);

const threadList = document.getElementById("threadList");
const modal = document.getElementById("modal");

document.getElementById("newThreadBtn").onclick = ()=>modal.style.display="flex";
window.onclick = e=>{ if(e.target===modal) modal.style.display="none"; };

async function loadThreads(){
  const { data } = await supabase
    .from("forum_posts")
    .select("id,title,category,created_at,profiles(username,role)")
    .order("created_at",{ascending:false});

  threadList.innerHTML = "";

  data.forEach(t=>{
    const role = t.profiles?.role || "user";

    threadList.innerHTML += `
      <div class="thread">
        <div>
          <h4>${t.title}</h4>
          <div class="meta">
            ${t.profiles?.username || "anon"}
            <span class="badge ${role}">${role}</span>
            • ${new Date(t.created_at).toLocaleString()}
          </div>
        </div>
        <div class="meta">💬 0</div>
      </div>
    `;
  });
}

async function createThread(){
  const title = titleInput.value;
  const body = bodyInput.value;
  const category = categoryInput.value;

  const { data:{user} } = await supabase.auth.getUser();

  await supabase.from("forum_posts").insert({
    title,
    content: body,
    category,
    user_id: user.id
  });

  modal.style.display="none";
  loadThreads();
}

supabase.channel("forum")
  .on("postgres_changes",{event:"INSERT",schema:"public",table:"forum_posts"},loadThreads)
  .subscribe();

loadThreads();