const supabase = supabase.createClient("URL","KEY");
const params = new URLSearchParams(location.search);
const threadId = params.get("id");

async function loadThread(){
  const {data} = await supabase
    .from("forum_posts")
    .select("title,content,profiles(username,role)")
    .eq("id",threadId)
    .single();

  threadBox.innerHTML = `
    <h2>${data.title}</h2>
    <div class="meta">${data.profiles.username}</div>
    <p>${data.content}</p>
  `;
}

async function loadReplies(){
  const {data} = await supabase
    .from("forum_replies")
    .select("content,created_at,profiles(username,role)")
    .eq("post_id",threadId)
    .order("created_at");

  replies.innerHTML="";
  data.forEach(r=>{
    replies.innerHTML += `
      <div class="reply">
        <b>${r.profiles.username}</b>
        <div class="meta">${new Date(r.created_at).toLocaleString()}</div>
        <p>${r.content}</p>
      </div>
    `;
  });
}

async function postReply(){
  const text = replyText.value;
  const {data:{user}} = await supabase.auth.getUser();

  await supabase.from("forum_replies").insert({
    post_id:threadId,
    content:text,
    user_id:user.id
  });

  replyText.value="";
}

supabase.channel("replies")
.on("postgres_changes",{event:"INSERT",table:"forum_replies"},loadReplies)
.subscribe();

loadThread();
loadReplies();