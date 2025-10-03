// Xử lý tìm kiếm (di chuyển từ event listener)
function performSearch(query) {
    fetch("/api/stories") // Gọi API lại để lọc dữ liệu
        .then((response) => response.json())
        .then((data) => {
            if (data) {
                const filteredStories = data.filter((story) =>
                    story.title.toLowerCase().includes(query.toLowerCase())
                );
                console.log(filteredStories);
                renderStories(filteredStories);
            }
        })
        .catch((error) => console.error("Search error:", error));
}

// Hàm render danh sách truyện (sửa đổi cho phù hợp với cấu trúc HTML mới)
// Hàm render danh sách truyện (JS thuần, không cần jQuery)
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

// Xử lý tìm kiếm
document.querySelector(".search-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const searchQuery = document.querySelector(".search-form input").value;
    performSearch(searchQuery);
});
   
// Gọi fetchStories khi trang tải xong
fetchStories();