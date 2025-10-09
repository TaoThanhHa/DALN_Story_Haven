// Category.js
document.addEventListener("DOMContentLoaded", async () => {
  // Chỉ chạy khi có container storyResults (chỉ trên category.html)
  const resultsContainer = document.getElementById("storyResults");
  const titleElem = document.getElementById("categoryTitle");
  const noResults = document.getElementById("noResults");
  if (!resultsContainer) return; // thoát nếu không phải trang category

  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");
  if (!category) {
    titleElem.textContent = "Không có thể loại được chọn";
    resultsContainer.innerHTML = `<p class="text-center text-muted">Vui lòng chọn một thể loại.</p>`;
    return;
  }

  titleElem.textContent = `Thể loại: ${decodeURIComponent(category)}`;

  try {
    // Gọi API (server-side route): /api/stories/category?category=...
    const res = await fetch(`/api/stories/category?category=${encodeURIComponent(category)}`);
    if (!res.ok) throw new Error("Network response was not ok");
    const stories = await res.json();

    resultsContainer.innerHTML = "";

    if (!Array.isArray(stories) || stories.length === 0) {
      noResults.style.display = "block";
      return;
    }
    noResults.style.display = "none";

    // Render grid giống search_result
    stories.forEach(story => {
      const col = document.createElement("div");
      col.className = "col-md-3 col-sm-6";
      col.innerHTML = `
        <a href="/story/${story.id}" class="text-decoration-none text-dark">
          <div class="card h-100 shadow-sm">
            <img src="${story.thumbnail || '../images/default.jpg'}" 
                 class="card-img-top story-thumbnail" 
                 alt="${escapeHtml(story.title)}">
            <div class="card-body">
              <h5 class="card-title text-truncate-2">${escapeHtml(story.title)}</h5>
            </div>
          </div>
        </a>
      `;
      resultsContainer.appendChild(col);
    });

  } catch (err) {
    console.error("Lỗi khi tải thể loại:", err);
    resultsContainer.innerHTML = `<p class="text-danger text-center mt-4">Đã xảy ra lỗi khi tải dữ liệu.</p>`;
  }

  // nhỏ: escape HTML để an toàn
  function escapeHtml(s) {
    if (!s) return "";
    return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
});
