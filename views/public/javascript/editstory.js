const STORYID = new URLSearchParams(window.location.search).get("id");
let selectedFile = null;
let currentControl = 0; // Lưu trạng thái control hiện tại (0: bản thảo, 1: đã đăng)

// Khi tải trang xong
document.addEventListener("DOMContentLoaded", () => {
  if (STORYID) {
    fetchStoryData(STORYID);
  }

  document.querySelector(".story").style.display = "block";
  document.querySelector(".chap").style.display = "none";
});

// Chuyển tab giữa Tác phẩm / Chapter
function changeContent(element, tab) {
  const storyElement = document.querySelector(".story");
  const chapElement = document.querySelector(".chap");

  if (tab === "Tạo tác phẩm") {
    storyElement.style.display = "block";
    chapElement.style.display = "none";
  } else {
    storyElement.style.display = "none";
    chapElement.style.display = "block";
    if (STORYID) {
      loadChapterList(STORYID);
    } else {
      alert("Vui lòng lưu truyện trước khi tạo chương!");
    }
  }

  document.querySelectorAll(".word").forEach(w => w.classList.remove("selected"));
  element.classList.add("selected");
}

// Lấy dữ liệu truyện
function fetchStoryData(storyId) {
  fetch(`/api/story/${storyId}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert("Không tìm thấy truyện!");
        return;
      }
      fillStoryData(data.story);
    })
    .catch(err => console.error("Lỗi khi lấy dữ liệu:", err));
}

// Điền dữ liệu vào form chỉnh sửa
function fillStoryData(story) {
  document.getElementById("story-title").value = story.title || "";
  document.getElementById("story-content").value = story.description || "";
  document.getElementById("status-select").value = story.status || "writing";

  // Lưu trạng thái control
  currentControl = story.control ? parseInt(story.control) : 0;
  updateControlButton();

  // Checkbox thể loại
  if (story.category) {
    const categories = story.category.split(",").map(c => c.trim());
    document.querySelectorAll("#category-list input[type='checkbox']").forEach(cb => {
      cb.checked = categories.includes(cb.value);
    });
  }

  if (story.thumbnail) {
    document.getElementById("preview-image").src = story.thumbnail;
  }
}

// 🟡 Cập nhật nút hiển thị theo trạng thái control
function updateControlButton() {
  const btn = document.getElementById("toggle-control-btn");
  if (!btn) return;
  btn.textContent = currentControl === 1 ? "Dừng đăng tải" : "Đăng tải";
}

// 🟢 Đổi trạng thái đăng tải
function togglePublish() {
  if (!STORYID) return alert("Không tìm thấy ID truyện!");

  const newControl = currentControl === 1 ? 0 : 1;

  fetch(`/api/story/${STORYID}/control`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ control: newControl })
  })
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        alert("Lỗi khi cập nhật trạng thái đăng tải!");
        return;
      }

      currentControl = newControl;
      updateControlButton();
      alert(`Truyện đã được ${newControl === 1 ? "đăng tải" : "dừng đăng tải"}.`);
    })
    .catch(err => console.error("Lỗi khi đổi trạng thái:", err));
}

// 🟢 Lưu thông tin truyện
function saveStory() {
  if (!STORYID) return alert("Không tìm thấy ID truyện!");

  const categories = Array.from(
    document.querySelectorAll("#category-list input[type='checkbox']:checked")
  ).map(cb => cb.value);

  const updatedStory = {
    title: document.getElementById("story-title").value.trim(),
    description: document.getElementById("story-content").value.trim(),
    category: categories.join(", "),
    status: document.getElementById("status-select").value,
    control: currentControl
  };

  fetch(`/api/story/${STORYID}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedStory)
  })
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        alert("Lỗi khi lưu truyện!");
        return;
      }

      if (selectedFile) {
        const formData = new FormData();
        formData.append("thumbnail", selectedFile);

        return fetch(`/api/story/${STORYID}/thumbnail`, {
          method: "PUT",
          body: formData
        })
          .then(res => res.json())
          .then(imgData => {
            if (imgData.success) {
              alert("Lưu truyện + ảnh bìa thành công!");
            } else {
              alert("Lưu truyện thành công nhưng lỗi khi cập nhật ảnh bìa!");
            }
          });
      } else {
        alert("Lưu truyện thành công!");
      }
    })
    .catch(err => console.error("Lỗi khi lưu:", err));
}

// 🟢 Load danh sách chương
function loadChapterList(storyId) {
  fetch(`/api/story/${storyId}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        document.getElementById("chapter-list").innerHTML = "<p>Không có dữ liệu chương.</p>";
        return;
      }
      fillChapterList(data.chapters);
    })
    .catch(err => console.error("Lỗi khi load chương:", err));
}

// Hiển thị danh sách chương
function fillChapterList(chapters) {
  const chapterListDiv = document.getElementById("chapter-list");

  if (!chapters || chapters.length === 0) {
    chapterListDiv.innerHTML = "<p>Chưa có chương nào.</p>";
    return;
  }

  let html = `
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Chapter</th>
          <th>Thời gian</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
  `;

  chapters.forEach(chap => {
    html += `
      <tr>
        <td>${chap.title}</td>
        <td>${new Date(chap.created_at).toLocaleDateString()}</td>
        <td>
          <a href="/editchapter?chapterId=${chap.id}" class="btn btn-sm btn-warning">Sửa</a>
          <button class="btn btn-sm btn-danger" onclick="deleteChapter(${chap.id})">Xóa</button>
        </td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  chapterListDiv.innerHTML = html;
}

// Thêm chương mới
function addChapter() {
  if (!STORYID) {
    alert("Vui lòng lưu truyện trước khi thêm chương!");
    return;
  }
  window.location.href = `/create-chapter?storyId=${STORYID}`;
}

// Xóa chương
function deleteChapter(chapterId) {
  if (!confirm("Bạn có chắc muốn xóa chương này?")) return;

  fetch(`/api/chapter/${chapterId}`, { method: "DELETE" })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Đã xóa chương!");
        loadChapterList(STORYID);
      } else {
        alert("Lỗi khi xóa chương!");
      }
    })
    .catch(err => console.error("Lỗi khi xóa:", err));
}

// Upload ảnh (chỉ preview, upload khi bấm lưu)
document.getElementById("image-upload").addEventListener("change", e => {
  selectedFile = e.target.files[0];
  if (selectedFile) {
    const reader = new FileReader();
    reader.onload = e => {
      document.getElementById("preview-image").src = e.target.result;
    };
    reader.readAsDataURL(selectedFile);
  }
});
