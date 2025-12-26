document.querySelectorAll(".stream-card").forEach(card => {
  const viewersEl = card.querySelector(".viewers");

  if (viewersEl) {
    const viewers = Math.floor(Math.random() * 900) + 20;
    viewersEl.textContent = `👀 ${viewers} watching`;
  }
});
