const supabaseUrl = "https://YOUR_PROJECT_ID.supabase.co";
const supabaseKey = "YOUR_PUBLIC_ANON_KEY";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

const postsDiv = document.getElementById("posts");

async function loadPosts() {
  const { data, error } = await supabase
    .from("forum_posts")
    .select("id, content, created_at, profiles(username, avatar_url)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  postsDiv.innerHTML = "";
  data.forEach(renderPost);
}

function renderPost(post) {
  const div = document.createElement("div");
  div.className = "post";

  div.innerHTML = `
    <img class="avatar" src="${post.profiles?.avatar_url || ''}">
    <div class="post-content">
      <div class="username">${post.profiles?.username || "Anonymous"}</div>
      <div class="time">${new Date(post.created_at).toLocaleString()}</div>
      <div class="text">${post.content}</div>
    </div>
  `;

  postsDiv.prepend(div);
}

async function createPost() {
  const content = document.getElementById("postContent").value.trim();
  if (!content) return;

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    alert("Login required");
    return;
  }

  await supabase.from("forum_posts").insert({
    content,
    user_id: user.id
  });

  document.getElementById("postContent").value = "";
}

supabase
  .channel("forum_posts")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "forum_posts" },
    payload => {
      renderPost(payload.new);
    }
  )
  .subscribe();

loadPosts();