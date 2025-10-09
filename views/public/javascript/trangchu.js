function renderStories(stories) {
    const storyContainer = document.getElementById("storyContainer");
    storyContainer.innerHTML = ""; // Xóa danh sách cũ

    stories.forEach((story) => {
        const storyCard = document.createElement("div");
        storyCard.className = "col-6 col-md-3 mb-3";

        storyCard.innerHTML = `
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
        storyContainer.appendChild(storyCard);
    });
}

// Gọi API để lấy danh sách truyện (loại bỏ phân trang)
function fetchStories() {
    fetch("/api/stories") // Thay bằng API thật của bạn
        .then((response) => response.json())
        .then((data) => {
            if (data) {
                renderStories(data);
            } else {
                console.error("Lỗi khi tải dữ liệu:", data.error);
            }
        })
        .catch((error) => console.error("Fetch error:", error));
}
   
// Gọi fetchStories khi trang tải xong
fetchStories();