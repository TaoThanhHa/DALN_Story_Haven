document.addEventListener("DOMContentLoaded", async function () {
  try {
    const response = await fetch("http://localhost:3000/api/storiesbyuser");
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const stories = await response.json();
    renderStories(stories);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách truyện:", error);
  }
});
let allStories = []; // Lưu tất cả truyện để tìm kiếm

document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("http://localhost:3000/api/storiesbyuser", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        allStories = await response.json(); // Lưu vào biến toàn cục
        renderStories(allStories);

        // Gắn sự kiện tìm kiếm
        const searchInput = document.getElementById("searchMyStory");
        searchInput.addEventListener("input", function () {
            const keyword = this.value.toLowerCase();
            const filteredStories = allStories.filter(story =>
                story.title && story.title.toLowerCase().includes(keyword)
            );
            renderStories(filteredStories);
        });

    } catch (error) {
        console.error("Lỗi khi lấy danh sách truyện:", error);
    }
});

function renderStories(stories) {
    const storyContainer = document.getElementById("storyContainer");
    storyContainer.innerHTML = ""; // Xóa danh sách cũ

    if (!stories.length) {
        storyContainer.innerHTML = `<p class="text-muted">Không có truyện nào.</p>`;
        return;
    }

    stories.forEach((story) => {
        storyContainer.innerHTML += `
            <div class="row g-0 mb-3 p-2 border rounded">
                <div class="col-md-3 d-flex justify-content-center">
                    <img src="./${story.thumbnail || '../images/default.jpg'}" class="img-fluid rounded" alt="Story Cover">
                </div>
                <div class="col-md-7">
                    <div class="story-details">
                        <h5 class="story-title">${story.title || "Không có tiêu đề"}</h5>
                        <p class="story-meta">Cập nhật: ${formatTime(story.created_at)}</p>
                        <p class="story-meta">
                            <i class="fas fa-eye"></i> ${story.views || 0} -
                            <i class="fas fa-star"></i> ${story.likes || 0} -
                            <i class="fas fa-comment"></i> ${story.comments || 0}
                        </p>
                    </div>
                </div>
                <div class="col-md-2 d-flex flex-column justify-content-around align-items-center">
                    <a href="/story/edit?id=${story.id}" class="btn btn-primary btn-sm mb-2 w-100">
                        <i class="fas fa-edit"></i> Sửa
                    </a>
                    <button class="btn btn-danger btn-sm w-100" onclick="deleteStory(${story.id})">
                        <i class="fas fa-trash"></i> Xóa
                    </button>
                </div>
            </div>
        `;
    });
}

function formatTime(updatedAt) {
    const timeDiff = Math.floor((new Date() - new Date(updatedAt)) / (1000 * 60 * 60));
    return timeDiff < 24 ? `${timeDiff} giờ trước` : `${Math.floor(timeDiff / 24)} ngày trước`;
}

async function deleteStory(storyId) {
    if (!confirm("Bạn có chắc muốn xóa truyện này?")) return;

    try {
        const response = await fetch(`http://localhost:3000/api/story/${storyId}`, {
            method: "DELETE",
        });

        if (!response.ok) throw new Error("Có lỗi xảy ra khi xóa truyện");

        // Cập nhật danh sách sau khi xóa
        allStories = allStories.filter(story => story.id !== storyId);
        renderStories(allStories);

    } catch (error) {
        console.error("Lỗi khi xóa truyện:", error);
        alert(error.message || "Có lỗi xảy ra khi xóa truyện");
    }
}
