/* admin.js */

// Toggle Sidebar Visibility (if you want to add collapsing feature)
const toggleSidebar = document.querySelector('#sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
const content = document.querySelector('.main-content');

toggleSidebar.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    content.classList.toggle('expanded');
});

// Confirm Logout
const logoutButton = document.querySelector('.logout-btn');
logoutButton.addEventListener('click', () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất không?')) {
        // Redirect to logout page or action
        window.location.href = 'logout.html';
    }
});