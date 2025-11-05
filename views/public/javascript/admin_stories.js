// public/javascript/admin_stories.js

let currentPage = 1;
let currentSearch = '';
let currentStatus = '';
let currentCategory = ''; // Để lọc theo thể loại

// Hàm định dạng ngày tháng
function formatDateTime(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // Định dạng 24h
    };
    return date.toLocaleDateString('vi-VN', options);
}

// Hàm tải danh sách truyện
async function fetchStories(page = 1, search = '', status = '', category = '') {
    try {
        const response = await fetch(`/admin/api/stories?page=${page}&limit=10&search=${search}&status=${status}&category=${category}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch stories');
        }

        displayStories(data.stories);
        setupPagination(data.totalStories, data.totalPages, data.currentPage);

        currentPage = data.currentPage;
        currentSearch = search;
        currentStatus = status;
        currentCategory = category;

    } catch (error) {
        console.error('Error fetching stories:', error);
        alert('Có lỗi xảy ra khi tải danh sách truyện: ' + error.message);
    }
}

// Hàm hiển thị truyện vào bảng
function displayStories(stories) {
    const storyTableBody = document.querySelector('#story-table-body');
    storyTableBody.innerHTML = ''; // Xóa dữ liệu cũ

    if (stories.length === 0) {
        storyTableBody.innerHTML = '<tr><td colspan="9">Không có truyện nào.</td></tr>';
        return;
    }

    stories.forEach(story => {
        const row = storyTableBody.insertRow();
        row.insertCell().textContent = story.id;
        
        const thumbnailCell = row.insertCell();
        const thumbnailImg = document.createElement('img');
        thumbnailImg.src = story.thumbnail || '/images/default-thumbnail.png'; // Thay bằng ảnh mặc định nếu không có
        thumbnailImg.alt = story.title;
        thumbnailImg.style.width = '60px';
        thumbnailImg.style.height = 'auto';
        thumbnailCell.appendChild(thumbnailImg);

        row.insertCell().textContent = story.title;
        row.insertCell().textContent = story.author_username;
        row.insertCell().textContent = story.category; // Hiển thị thể loại từ cột category
        row.insertCell().textContent = story.status === 'complete' ? 'Hoàn thành' : (story.status === 'writing' ? 'Đang viết' : (story.status === 'blocked' ? 'Bị khóa' : 'Đã duyệt')); // Hiện thị rõ hơn
        row.insertCell().textContent = story.total_chapters;
        row.insertCell().textContent = formatDateTime(story.created_at);

        const actionsCell = row.insertCell();
        const detailButton = document.createElement('button');
        detailButton.textContent = 'Chi tiết/Sửa';
        detailButton.className = 'btn btn-sm btn-info';
        detailButton.onclick = () => openStoryModal(story.id);
        actionsCell.appendChild(detailButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Xóa';
        deleteButton.className = 'btn btn-sm btn-danger ml-2';
        deleteButton.onclick = () => deleteStory(story.id);
        actionsCell.appendChild(deleteButton);
    });
}

// Hàm thiết lập phân trang
function setupPagination(totalItems, totalPages, currentPage) {
    const paginationDiv = document.getElementById('story-pagination');
    paginationDiv.innerHTML = ''; // Xóa phân trang cũ

    if (totalPages <= 1) return;

    // Nút Previous
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Trước';
    prevButton.className = 'btn btn-outline-primary mr-1';
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => fetchStories(currentPage - 1, currentSearch, currentStatus, currentCategory);
    paginationDiv.appendChild(prevButton);

    // Các nút số trang
    const maxPagesToShow = 5; // Số nút trang tối đa hiển thị
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
        const firstPageButton = document.createElement('button');
        firstPageButton.textContent = '1';
        firstPageButton.className = 'btn btn-outline-primary mr-1';
        firstPageButton.onclick = () => fetchStories(1, currentSearch, currentStatus, currentCategory);
        paginationDiv.appendChild(firstPageButton);
        if (startPage > 2) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            dots.className = 'mx-1';
            paginationDiv.appendChild(dots);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = `btn btn-outline-primary mr-1 ${i === currentPage ? 'active' : ''}`;
        pageButton.onclick = () => fetchStories(i, currentSearch, currentStatus, currentCategory);
        paginationDiv.appendChild(pageButton);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            dots.className = 'mx-1';
            paginationDiv.appendChild(dots);
        }
        const lastPageButton = document.createElement('button');
        lastPageButton.textContent = totalPages;
        lastPageButton.className = 'btn btn-outline-primary mr-1';
        lastPageButton.onclick = () => fetchStories(totalPages, currentSearch, currentStatus, currentCategory);
        paginationDiv.appendChild(lastPageButton);
    }

    // Nút Next
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Sau';
    nextButton.className = 'btn btn-outline-primary';
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => fetchStories(currentPage + 1, currentSearch, currentStatus, currentCategory);
    paginationDiv.appendChild(nextButton);
}

// Hàm xử lý tìm kiếm và lọc
function searchAndFilterStories() {
    const searchInput = document.getElementById('story-search-input').value;
    const statusFilter = document.getElementById('story-status-filter').value;
    const categoryFilter = document.getElementById('story-category-filter').value;
    fetchStories(1, searchInput, statusFilter, categoryFilter);
}

// Hàm mở modal và tải chi tiết truyện
async function openStoryModal(storyId) {
    const storyModal = document.getElementById('storyModal');
    storyModal.style.display = 'block';
    storyModal.classList.add('show');

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    backdrop.id = 'storyModalBackdrop';
    document.body.appendChild(backdrop);
    document.body.classList.add('modal-open');

    try {
        // Tải danh sách thể loại vào modal SELECT trước
        await loadCategoriesIntoModalFilter(); // Gọi hàm này khi mở modal
        
        const response = await fetch(`/admin/api/stories/${storyId}`);
        const story = await response.json();

        if (!response.ok) {
            throw new Error(story.error || 'Failed to fetch story details');
        }

        document.getElementById('modalStoryId').value = story.id;
        document.getElementById('modalStoryTitle').value = story.title;
        document.getElementById('modalAuthorUsername').value = story.author_username;
        document.getElementById('modalDescription').value = story.description;
        document.getElementById('modalThumbnailImg').src = story.thumbnail || '/images/default-thumbnail.png';
        document.getElementById('modalThumbnail').value = story.thumbnail || '';
        
        // Đặt giá trị mặc định cho select thể loại
        const modalCategorySelect = document.getElementById('modalCategory');
        modalCategorySelect.value = story.category; // Đảm bảo option này tồn tại trong select
        
        document.getElementById('modalStatus').value = story.status;
        document.getElementById('modalCreatedAt').value = formatDateTime(story.created_at);

        // Hiển thị danh sách chương
        const chaptersListBody = document.getElementById('modalChaptersList');
        chaptersListBody.innerHTML = '';
        if (story.chapters && story.chapters.length > 0) {
            story.chapters.forEach(chapter => {
                const row = chaptersListBody.insertRow();
                row.insertCell().textContent = chapter.chapter_number;
                row.insertCell().textContent = chapter.title;
                row.insertCell().textContent = formatDateTime(chapter.created_at);
            });
        } else {
            chaptersListBody.innerHTML = '<tr><td colspan="3">Chưa có chương nào.</td></tr>';
        }

    } catch (error) {
        console.error('Error opening story modal:', error);
        alert('Có lỗi xảy ra khi tải chi tiết truyện: ' + error.message);
        hideModal('storyModal');
    }
}

// Hàm đóng modal (có thể dùng chung cho các modal)
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
        // Xóa backdrop nếu có
        const backdrop = document.getElementById('storyModalBackdrop');
        if (backdrop) {
            backdrop.remove();
        }
        document.body.classList.remove('modal-open');
    }
}


// Hàm lưu thay đổi trạng thái truyện
async function saveStoryChanges() {
    const storyId = document.getElementById('modalStoryId').value;
    const status = document.getElementById('modalStatus').value;
    const category = document.getElementById('modalCategory').value; // Lấy giá trị thể loại mới

    try {
        const response = await fetch(`/admin/api/stories/${storyId}`, { // SỬA API endpoint ở đây
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status, category }) // Gửi cả status và category
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'Failed to save story changes');
        }

        alert('Cập nhật truyện thành công!'); // Sửa thông báo
        hideModal('storyModal');
        fetchStories(currentPage, currentSearch, currentStatus, currentCategory); // Tải lại danh sách
    } catch (error) {
        console.error('Error saving story changes:', error);
        alert('Có lỗi xảy ra khi lưu thay đổi truyện: ' + error.message);
    }
}

// Hàm xóa truyện
async function deleteStory(storyId) {
    if (!confirm('Bạn có chắc chắn muốn xóa truyện này? Thao tác này sẽ xóa tất cả các chương liên quan.')) {
        return;
    }

    try {
        const response = await fetch(`/admin/api/stories/${storyId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'Failed to delete story');
        }

        alert('Xóa truyện thành công!');
        hideModal('storyModal'); // Đóng modal nếu đang mở
        fetchStories(currentPage, currentSearch, currentStatus, currentCategory); // Tải lại danh sách
    } catch (error) {
        console.error('Error deleting story:', error);
        alert('Có lỗi xảy ra khi xóa truyện: ' + error.message);
    }
}


// Tải danh sách thể loại động vào filter (dùng cho bộ lọc chính)
async function loadCategoriesIntoFilter() {
    const categoryFilter = document.getElementById('story-category-filter');
    categoryFilter.querySelectorAll('option:not([value=""])').forEach(option => option.remove());

    try {
        const response = await fetch('/admin/api/story-categories');
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        const categories = await response.json();

        categories.forEach(catName => {
            if (catName) {
                const option = document.createElement('option');
                option.value = catName;
                option.textContent = catName;
                categoryFilter.appendChild(option);
            }
        });
    } catch (error) {
        console.error('Error loading categories into filter:', error);
    }
}

// HÀM MỚI: Tải danh sách thể loại vào SELECT của modal chỉnh sửa truyện
async function loadCategoriesIntoModalFilter() {
    const modalCategorySelect = document.getElementById('modalCategory');
    // Xóa tất cả các option hiện có (trừ khi bạn muốn giữ lại một placeholder nào đó)
    modalCategorySelect.innerHTML = ''; 

    // Thêm một option rỗng hoặc "Chọn thể loại" nếu bạn muốn
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Chọn thể loại';
    modalCategorySelect.appendChild(defaultOption);

    try {
        const response = await fetch('/admin/api/story-categories');
        if (!response.ok) {
            throw new Error('Failed to fetch categories for modal');
        }
        const categories = await response.json();

        categories.forEach(catName => {
            if (catName) {
                const option = document.createElement('option');
                option.value = catName;
                option.textContent = catName;
                modalCategorySelect.appendChild(option);
            }
        });
    } catch (error) {
        console.error('Error loading categories into modal filter:', error);
    }
}


// Khởi tạo khi DOM được tải
document.addEventListener('DOMContentLoaded', () => {
    fetchStories();
    loadCategoriesIntoFilter(); // Tải danh sách thể loại vào bộ lọc chính

    // ... (các sự kiện khác) ...
    document.getElementById('story-search-input').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            searchAndFilterStories();
        }
    });
    document.getElementById('story-status-filter').addEventListener('change', searchAndFilterStories);
    document.getElementById('story-category-filter').addEventListener('change', searchAndFilterStories);

    const saveStoryChangesBtn = document.getElementById('saveStoryChangesBtn');
    if (saveStoryChangesBtn) {
        saveStoryChangesBtn.addEventListener('click', saveStoryChanges);
    }

    const deleteStoryBtn = document.getElementById('deleteStoryBtn');
    if (deleteStoryBtn) {
        deleteStoryBtn.addEventListener('click', () => {
            const storyId = document.getElementById('modalStoryId').value;
            if (storyId) {
                deleteStory(storyId);
            }
        });
    }

    window.onclick = function(event) {
        const storyModal = document.getElementById('storyModal');
        const backdrop = document.getElementById('storyModalBackdrop');
        if (event.target == storyModal || event.target == backdrop) {
            hideModal('storyModal');
        }
    };
});