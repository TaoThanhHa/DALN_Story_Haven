document.addEventListener("DOMContentLoaded", function () {
    fetchStories();
});

// Gọi API để lấy danh sách truyện
function fetchStories() {
    fetch("http://localhost:3000/api/stories") // Thay bằng API thật của bạn
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

function renderStories(stories) {
    const storyContainer = document.querySelector(".related-stories .row");
    storyContainer.innerHTML = "";

    stories.forEach((story) => {
        const storyCard = document.createElement("a");
        storyCard.href = `/story/${story.id}`;
        storyCard.className = "col-6 col-md-3 mb-3";
        storyCard.innerHTML = `
            <div class="card">
                <img src="${story.thumbnail || "../images/default.jpg"}" class="card-img-top" alt="${story.title}">
                <div class="card-body">
                    <h5 class="card-title">${story.title}</h5>
                </div>
            </div>
        `;
        storyContainer.appendChild(storyCard);
    });
}

// Xử lý tìm kiếm
document.querySelector(".search-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const searchQuery = document.querySelector(".search-form input").value.toLowerCase();
    console.log(searchQuery);
    
    fetch("http://localhost:3000/api/stories") // Gọi API lại để lọc dữ liệu
        .then((response) => response.json())
        .then((data) => {
            if (data) {
                const filteredStories = data.filter((story) =>
                    story.title.toLowerCase().includes(searchQuery)
                );
                console.log(filteredStories);
                
                renderStories(filteredStories);
            }
        })
        .catch((error) => console.error("Search error:", error));
});
