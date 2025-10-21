// public/js/Library.js
document.addEventListener("DOMContentLoaded", function () {
  fetchStories();
});

function fetchStories() {
  fetch("/api/library", { credentials: "include" })
    .then(response => response.json())
    .then(data => {
      if (Array.isArray(data)) renderStories(data);
      else console.error("Không có dữ liệu:", data.error);
    })
    .catch(error => console.error("Fetch error:", error));
}

function renderStories(stories) {
  const container = document.getElementById("storiesContainer");
  container.innerHTML = "";

  if (stories.length === 0) {
    container.innerHTML = "<p>Bạn chưa theo dõi truyện nào.</p>";
    return;
  }

  stories.forEach(story => {
    const card = document.createElement("div");
    card.classList.add("story-card");

    card.innerHTML = `
      <div class="story-thumbnail">
        <img src="${story.thumbnail}" alt="${story.title}">
      </div>
      <div class="story-info">
        <h5>${story.title}</h5>
        <p>${story.category || ""}</p>
        <button class="btn btn-primary" onclick="window.location.href='/story/${story.id}'">Đọc ngay</button>
      </div>
    `;

    container.appendChild(card);
  });
}
