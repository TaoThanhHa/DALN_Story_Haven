document.addEventListener("DOMContentLoaded", function () {
  const pathSegments = window.location.pathname.split("/");
  const storyId = pathSegments[pathSegments.length - 1];
  if (!storyId) return;

  // --- Gọi API lấy thông tin truyện ---
  fetchStoryData(storyId);
  // --- Kiểm tra trạng thái theo dõi ---
  checkFollowStatus(storyId);

  // --- Nút theo dõi ---
  const followBtn = document.getElementById("followBtn");
  if (followBtn) {
    followBtn.addEventListener("click", () => toggleFollow(storyId));
  }
});

let allChapters = [];
let currentPage = 1;
const itemsPerPage = 10;

// 🧩 Lấy thông tin truyện
function fetchStoryData(storyId) {
  fetch(`/api/story/${storyId}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert("Không tìm thấy truyện!");
        return;
      }
      fillStoryData(data.story, data.chapters);
    })
    .catch(err => console.error("Lỗi khi lấy dữ liệu:", err));
}

// 🧩 Điền thông tin truyện vào giao diện
function fillStoryData(story, chapters) {
  document.querySelector(".story-name").textContent = story.title;
  document.querySelector(".story-infor ul").innerHTML = `
    <li>Tác giả: ${story.username}</li>
    <li>Thể loại: ${story.category}</li>
  `;
  document.querySelector(".story-description").textContent = story.description;

  if (story.thumbnail) {
    document.querySelector(".cover-photo img").src = story.thumbnail;
    document.querySelector(".story").style.backgroundImage = `url('${story.thumbnail}')`;
  }

  if (story.views) document.getElementById("views").textContent = story.views;
  if (story.likes) document.getElementById("likes").textContent = story.likes;

  allChapters = chapters;
  renderChapters();
  renderPagination();

  if (chapters.length > 0) {
    document.querySelector(".btn-read").href = `/story/${story.id}/chapter/${chapters[0].id}`;
  }
}

// 🧩 Hiển thị danh sách chương
function renderChapters() {
  const container = document.getElementById("chapterList");
  container.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const visibleChapters = allChapters.slice(start, end);

  visibleChapters.forEach(chap => {
    const a = document.createElement("a");
    a.href = `/story/${chap.story_id}/chapter/${chap.id}`;
    a.classList.add("list-group-item", "list-group-item-action", "episode");
    if (chap.read) a.classList.add("read");
    a.innerHTML = `
      <span class="episode-item-num">${chap.chapter_number}</span>
      <span class="episode-item-title">CHAP ${chap.chapter_number}: ${chap.title}</span>
    `;
    container.appendChild(a);
  });
}

// 🧩 Phân trang
function renderPagination() {
  const pagination = document.getElementById("chapterPagination");
  pagination.innerHTML = "";

  const totalPages = Math.ceil(allChapters.length / itemsPerPage);
  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    li.classList.add("page-item");
    if (i === currentPage) li.classList.add("active");

    const link = document.createElement("a");
    link.classList.add("page-link");
    link.href = "#";
    link.textContent = i;
    link.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage = i;
      renderChapters();
      renderPagination();
    });

    li.appendChild(link);
    pagination.appendChild(li);
  }
}

// ❤️ Kiểm tra trạng thái theo dõi
function checkFollowStatus(storyId) {
  fetch(`/api/story/follow-status/${storyId}`, { credentials: "include" })
    .then(res => res.json())
    .then(data => {
      const btn = document.getElementById("followBtn");
      if (!btn) return;
      if (data.followed) {
        btn.classList.add("btn-danger");
        btn.innerHTML = '<i class="fas fa-heart"></i> Đang theo dõi';
      } else {
        btn.classList.remove("btn-danger");
        btn.innerHTML = '<i class="fas fa-heart"></i> Theo dõi';
      }
    })
    .catch(err => console.error("Lỗi kiểm tra follow:", err));
}

// ❤️ Toggle follow / unfollow
function toggleFollow(storyId) {
  fetch("/api/story/follow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ storyId })
  })
    .then(res => res.json())
    .then(data => {
      const btn = document.getElementById("followBtn");
      if (!btn) return;
      if (data.followed) {
        btn.classList.add("btn-danger");
        btn.innerHTML = '<i class="fas fa-heart"></i> Đang theo dõi';
      } else {
        btn.classList.remove("btn-danger");
        btn.innerHTML = '<i class="fas fa-heart"></i> Theo dõi';
      }
    })
    .catch(err => console.error("Lỗi khi toggle follow:", err));
}
