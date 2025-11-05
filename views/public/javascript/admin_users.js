// public/javascript/admin_users.js

let currentPage = 1;
let currentSearch = '';
let currentRole = '';
let currentStatus = '';

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

// Hàm tải danh sách người dùng
async function fetchUsers(page = 1, search = '', role = '', status = '') {
    try {
        const response = await fetch(`/admin/api/users?page=${page}&limit=10&search=${search}&role=${role}&status=${status}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch users');
        }

        displayUsers(data.users);
        setupPagination(data.totalUsers, data.totalPages, data.currentPage);

        currentPage = data.currentPage;
        currentSearch = search;
        currentRole = role;
        currentStatus = status;

    } catch (error) {
        console.error('Error fetching users:', error);
        alert('Có lỗi xảy ra khi tải danh sách người dùng: ' + error.message);
    }
}

// Hàm hiển thị người dùng vào bảng
function displayUsers(users) {
    const userTableBody = document.querySelector('#user-table tbody');
    userTableBody.innerHTML = ''; // Xóa dữ liệu cũ

    if (users.length === 0) {
        userTableBody.innerHTML = '<tr><td colspan="7">Không có người dùng nào.</td></tr>';
        return;
    }

    users.forEach(user => {
        const row = userTableBody.insertRow();
        row.insertCell().textContent = user.id;
        row.insertCell().textContent = user.username;
        row.insertCell().textContent = user.email;
        row.insertCell().textContent = user.role;
        row.insertCell().textContent = user.status === 'active' ? 'Hoạt động' : 'Bị khóa';
        row.insertCell().textContent = formatDateTime(user.created_at);

        const actionsCell = row.insertCell();
        const editButton = document.createElement('button');
        editButton.textContent = 'Chi tiết/Sửa';
        editButton.className = 'btn btn-sm btn-info';
        editButton.onclick = () => openUserModal(user.id);
        actionsCell.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Xóa';
        deleteButton.className = 'btn btn-sm btn-danger ml-2';
        deleteButton.onclick = () => deleteUser(user.id);
        actionsCell.appendChild(deleteButton);
    });
}

// Hàm thiết lập phân trang
function setupPagination(totalItems, totalPages, currentPage) {
    const paginationDiv = document.getElementById('user-pagination');
    paginationDiv.innerHTML = ''; // Xóa phân trang cũ

    if (totalPages <= 1) return;

    // Nút Previous
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Trước';
    prevButton.className = 'btn btn-outline-primary mr-1';
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => fetchUsers(currentPage - 1, currentSearch, currentRole, currentStatus);
    paginationDiv.appendChild(prevButton);

    // Các nút số trang
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = `btn btn-outline-primary mr-1 ${i === currentPage ? 'active' : ''}`;
        pageButton.onclick = () => fetchUsers(i, currentSearch, currentRole, currentStatus);
        paginationDiv.appendChild(pageButton);
    }

    // Nút Next
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Sau';
    nextButton.className = 'btn btn-outline-primary';
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => fetchUsers(currentPage + 1, currentSearch, currentRole, currentStatus);
    paginationDiv.appendChild(nextButton);
}

// Hàm xử lý tìm kiếm và lọc
function searchAndFilterUsers() {
    const searchInput = document.getElementById('search-input').value;
    const roleFilter = document.getElementById('role-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    fetchUsers(1, searchInput, roleFilter, statusFilter);
}

// Hàm mở modal và tải chi tiết người dùng
async function openUserModal(userId) {
    const userModal = document.getElementById('userModal');
    userModal.style.display = 'block';

    try {
        const response = await fetch(`/admin/api/users/${userId}`);
        const user = await response.json();

        if (!response.ok) {
            throw new Error(user.error || 'Failed to fetch user details');
        }

        document.getElementById('modalTitle').textContent = `Chi tiết người dùng: ${user.username}`;
        document.getElementById('modalUserId').value = user.id;
        document.getElementById('modalUsername').value = user.username;
        document.getElementById('modalEmail').value = user.email;
        document.getElementById('modalRole').value = user.role;
        document.getElementById('modalStatus').value = user.status;
        document.getElementById('modalCreatedAt').value = formatDateTime(user.created_at);
        document.getElementById('modalTotalStories').value = user.total_stories;

        // Xử lý nút Xóa: nếu là tài khoản đang đăng nhập, không cho phép xóa
        const currentAdminId = document.querySelector('body').dataset.userId; // Giả sử bạn lưu user_id của admin vào dataset của body
        if (currentAdminId && parseInt(currentAdminId) === user.id) {
            document.getElementById('deleteUserBtn').style.display = 'none';
        } else {
            document.getElementById('deleteUserBtn').style.display = 'inline-block';
        }

    } catch (error) {
        console.error('Error opening user modal:', error);
        alert('Có lỗi xảy ra khi tải chi tiết người dùng: ' + error.message);
        hideModal('userModal');
    }
}

// Hàm đóng modal
function hideModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Hàm lưu thay đổi người dùng
async function saveUserChanges() {
    const userId = document.getElementById('modalUserId').value;
    const role = document.getElementById('modalRole').value;
    const status = document.getElementById('modalStatus').value;

    try {
        const response = await fetch(`/admin/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ role, status })
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'Failed to save changes');
        }

        alert('Cập nhật người dùng thành công!');
        hideModal('userModal');
        fetchUsers(currentPage, currentSearch, currentRole, currentStatus); // Tải lại danh sách
    } catch (error) {
        console.error('Error saving user changes:', error);
        alert('Có lỗi xảy ra khi lưu thay đổi: ' + error.message);
    }
}

// Hàm xóa người dùng
async function deleteUser(userId) {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này? Thao tác này sẽ xóa tất cả truyện và chương của họ.')) {
        return;
    }

    try {
        const response = await fetch(`/admin/api/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'Failed to delete user');
        }

        alert('Xóa người dùng thành công!');
        fetchUsers(currentPage, currentSearch, currentRole, currentStatus); // Tải lại danh sách
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Có lỗi xảy ra khi xóa người dùng: ' + error.message);
    }
}

// Gắn sự kiện cho các nút trong modal
document.addEventListener('DOMContentLoaded', () => {
    // Tải danh sách người dùng khi trang được tải
    fetchUsers();

    // Gắn sự kiện cho nút "Lưu thay đổi" trong modal
    const saveUserBtn = document.getElementById('saveUserBtn');
    if (saveUserBtn) {
        saveUserBtn.addEventListener('click', saveUserChanges);
    }

    // Gắn sự kiện cho nút "Xóa người dùng" trong modal
    const deleteUserBtn = document.getElementById('deleteUserBtn');
    if (deleteUserBtn) {
        // Chỉ gắn sự kiện click, logic xác nhận và gọi API nằm trong hàm deleteUser
        deleteUserBtn.addEventListener('click', () => {
            const userId = document.getElementById('modalUserId').value;
            if (userId) {
                deleteUser(userId);
            }
        });
    }

    // Đóng modal khi click ra ngoài hoặc nhấn Esc (tùy chọn)
    window.onclick = function(event) {
        const userModal = document.getElementById('userModal');
        if (event.target == userModal) {
            hideModal('userModal');
        }
    };

    // Có thể thêm event listener cho input search và filter change để tự động tìm kiếm/lọc
    // Ví dụ: Khi thay đổi select box, tự động search
    document.getElementById('role-filter').addEventListener('change', searchAndFilterUsers);
    document.getElementById('status-filter').addEventListener('change', searchAndFilterUsers);
    document.getElementById('search-input').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            searchAndFilterUsers();
        }
    });

    // Truyền userId của admin đang đăng nhập vào body để kiểm tra tự xóa
    // Đảm bảo bạn có một session chứa user_id của admin
    // Ví dụ: <body data-user-id="<%= locals.user ? locals.user.id : '' %>">
    // Bạn cần thêm logic này vào admin_layout.ejs hoặc admin_users.ejs nếu chưa có
});