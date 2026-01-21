const id = new URLSearchParams(location.search).get("id");

async function loadThread() {
  const { data } = await supabase.from("forum_threads").select("*").eq("id", id).single();
  document.getElementById("thread").innerHTML = `<h2>${data.title}</h2>${data.body}`;
  if (data.locked) document.querySelector("textarea").disabled = true;
}

async function loadReplies() {
  const { data } = await supabase.from("forum_replies").select("*").eq("thread_id", id);
  replies.innerHTML = data.map(r => `<div>${r.body}</div>`).join("");
}

async function postReply() {
  const user = (await supabase.auth.getUser()).data.user;
  await supabase.from("forum_replies").insert({
    thread_id: id,
    body: reply.value,
    user_id: user.id
  });
  reply.value = "";
}

loadThread();
loadReplies();

supabase.channel("replies")
  .on("postgres_changes", { event: "*", table: "forum_replies" }, loadReplies)
  .subscribe();