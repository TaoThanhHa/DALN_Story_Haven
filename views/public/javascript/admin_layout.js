// admin_layout.js

document.addEventListener('DOMContentLoaded', function() {
    const toggleSidebarBtn = document.querySelector('.toggle-sidebar');
    const sidebar = document.querySelector('.sidebar');
    const logoutBtn = document.getElementById('logout-btn');
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.sidebar-nav ul li a');

    // Highlight active nav link
    navLinks.forEach(link => {
        if (currentPath.startsWith(link.getAttribute('href'))) {
            link.classList.add('active');
        }
    });

    // Toggle sidebar (optional, can be expanded for full collapse)
    if (toggleSidebarBtn) {
        toggleSidebarBtn.addEventListener('click', function() {
            // For now, let's just make it a placeholder or simple toggle
            // A more complex implementation would involve changing CSS classes
            // on .admin-wrapper or .sidebar to fully collapse/expand
            console.log('Toggle sidebar clicked');
            // Example:
            // document.body.classList.toggle('sidebar-collapsed');
        });
    }

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            // Assuming you have an API endpoint for logout
            try {
                const response = await fetch('/api/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    alert('Đăng xuất thành công!');
                    window.location.href = '/login'; // Redirect to login page
                } else {
                    const errorData = await response.json();
                    alert(`Đăng xuất thất bại: ${errorData.error}`);
                }
            } catch (error) {
                console.error('Lỗi khi đăng xuất:', error);
                alert('Có lỗi xảy ra khi đăng xuất.');
            }
        });
    }

    // A generic function to show/hide modals
    window.showModal = function(modalId) {
        document.getElementById(modalId).style.display = 'flex';
    };

    window.hideModal = function(modalId) {
        document.getElementById(modalId).style.display = 'none';
    };

    // Close modal when clicking on the close button or outside
    document.querySelectorAll('.modal .close-button').forEach(button => {
        button.addEventListener('click', function() {
            hideModal(button.closest('.modal').id);
        });
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideModal(modal.id);
            }
        });
    });
});