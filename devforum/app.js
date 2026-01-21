const modal = document.getElementById('threadModal');
const threadsDiv = document.getElementById('threads');
const emptyState = document.getElementById('emptyState');

document.getElementById('newThreadBtn').onclick = openModal;

function openModal() {
  modal.style.display = 'flex';
}

function closeModal() {
  modal.style.display = 'none';
}

function createThread() {
  const title = document.getElementById('titleInput').value;
  const content = document.getElementById('contentInput').value;
  const category = document.getElementById('categoryInput').value;

  if (!title || !content) return alert("Fill everything");

  addThread({
    title,
    content,
    category,
    user: "You 👑",
    replies: 0
  });

  closeModal();
}

function addThread(t) {
  emptyState.style.display = "none";

  const card = document.createElement('div');
  card.className = "thread-card";

  card.innerHTML = `
    <h3><span class="badge">${t.category}</span> ${t.title}</h3>
    <div class="meta">${t.user} • just now • ${t.replies} replies</div>
    <p>${t.content.substring(0,120)}...</p>
    <div>👑 Owner</div>
  `;

  threadsDiv.prepend(card);
}