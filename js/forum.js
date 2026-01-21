async function loadThreads() {
  const { data } = await supabase
    .from("forum_threads")
    .select("*")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });

  const box = document.getElementById("threads");
  box.innerHTML = "";

  data.forEach(t => {
    const div = document.createElement("div");
    div.className = "thread";
    div.innerHTML = `
      ${t.pinned ? "📌" : ""}
      <a href="thread.html?id=${t.id}">${t.title}</a>
      ${t.locked ? "🔒" : ""}
    `;
    box.appendChild(div);
  });
}

loadThreads();

supabase.channel("threads")
  .on("postgres_changes", { event: "*", schema: "public", table: "forum_threads" }, loadThreads)
  .subscribe();