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

// Xử lý tìm kiếm
document.querySelector(".search-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const searchQuery = document.querySelector(".search-form input").value;
    performSearch(searchQuery);
});