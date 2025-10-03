document.addEventListener("DOMContentLoaded", function () {
  const pathSegments = window.location.pathname.split("/");
  const storyId = pathSegments[pathSegments.length - 1];
  if (storyId) fetchStoryData(storyId);
});

// Gọi API để lấy thông tin truyện
function fetchStoryData(storyId) {
  fetch(`/api/story/${storyId}`)
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        alert("Không tìm thấy truyện!");
        return;
      }
      fillStoryData(data.story, data.chapters);
    })
    .catch(error => console.error("Lỗi khi lấy dữ liệu:", error));
}

let allChapters = [];
let currentPage = 1;
const itemsPerPage = 10;

// Điền dữ liệu truyện vào giao diện
function fillStoryData(story, chapters) {
  document.querySelector(".story-name").textContent = story.title;
  document.querySelector(".story-infor ul").innerHTML = `
    <li>Tác giả: ${story.username}</li>
    <li>Thể loại: ${story.category}</li>
  `;
  document.querySelector(".story-description").textContent = story.description;

  // Đồng bộ ảnh nền + ảnh bìa
  if (story.thumbnail) {
    document.querySelector(".cover-photo img").src = story.thumbnail;
    document.querySelector(".story").style.backgroundImage = `url('${story.thumbnail}')`;
  }

  // Views / Likes
  if (story.views) document.getElementById("views").textContent = story.views;
  if (story.likes) document.getElementById("likes").textContent = story.likes;

  // Lưu tất cả chương để phân trang
  allChapters = chapters;

  // Hiển thị trang đầu tiên
  renderChapters();
  renderPagination();

  // Nút đọc từ chương 1
  if (chapters.length > 0) {
    document.querySelector(".btn-read").href = `/story/${story.id}/chapter/${chapters[0].id}`;
  }
}

// Render chương theo trang
function renderChapters() {
  const chapterListContainer = document.getElementById("chapterList");
  chapterListContainer.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const visibleChapters = allChapters.slice(start, end);

  visibleChapters.forEach(chap => {
    const chapItem = document.createElement("a");
    chapItem.href = `/story/${chap.story_id}/chapter/${chap.id}`;
    chapItem.classList.add("list-group-item", "list-group-item-action", "episode");
    if (chap.read) chapItem.classList.add("read");

    chapItem.innerHTML = `
      <span class="episode-item-num">${chap.chapter_number}</span>
      <span class="episode-item-title">CHAP ${chap.chapter_number}: ${chap.title}</span>
    `;
    chapterListContainer.appendChild(chapItem);
  });
}

// Render pagination
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
