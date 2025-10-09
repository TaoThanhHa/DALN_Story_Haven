// ------------------------------
// search.js — dùng cho mọi trang
// ------------------------------

function performSearch(query) {
  if (!query) return;

  // Gọi API tìm kiếm theo từ khóa
  fetch(`/api/stories/search?title=${encodeURIComponent(query)}`)
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      renderStories(data);
    })
    .catch((error) => console.error("Search error:", error));
}

// Hiển thị danh sách truyện
function renderStories(stories) {
  const container = document.getElementById("searchResults");
  if (!container) return; // Nếu không ở trang kết quả thì thoát

  container.innerHTML = "";

  if (stories.length === 0) {
    container.innerHTML = "<p class='text-center mt-4'>Không tìm thấy truyện nào.</p>";
    return;
  }

  const row = document.createElement("div");
  row.classList.add("row", "g-4");

  stories.forEach((story) => {
    const col = document.createElement("div");
    col.classList.add("col-md-3", "col-sm-6");

    col.innerHTML = `
      <a href="/story/${story.id}" class="text-decoration-none text-dark">
        <div class="card h-100 shadow-sm">
          <img src="${story.thumbnail || "../images/default.jpg"}"
              class="card-img-top story-thumbnail"
              alt="${story.title}">
          <div class="card-body">
            <h5 class="card-title text-truncate-2">${story.title}</h5>
          </div>
        </div>
      </a>
    `;

    row.appendChild(col);
  });

  container.appendChild(row);
}

// Xử lý khi người dùng nhấn "Tìm kiếm"
document.querySelectorAll(".search-form").forEach((form) => {
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const searchQuery = this.querySelector("input").value.trim();
    if (!searchQuery) return;

    // Chuyển hướng đến trang kết quả
    window.location.href = `/search?query=${encodeURIComponent(searchQuery)}`;
  });
});

// Khi đang ở trang search_result.html, tự động gọi API
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("query");
  if (query) {
    performSearch(query);
    const input = document.querySelector(".search-form input");
    if (input) input.value = query;
  }
});
