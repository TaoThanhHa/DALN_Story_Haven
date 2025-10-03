document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Ngăn chặn submit mặc định

        const email = document.getElementById('user').value; // Đổi user thành email để khớp API
        const password = document.getElementById('pass').value; // Đổi pass thành password

        const data = {
            email: email,
            password: password
        };

        try {
            const response = await fetch('/api/login', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data) // Gửi dữ liệu dưới dạng JSON
            });

            const result = await response.json();

            if (response.ok && result.success) {
                alert('Đăng nhập thành công!');
                window.location.href = '/'; // Chuyển hướng đến trang chính
              
            } else {
                // Đăng nhập thất bại
                errorMessage.textContent = result.error || 'Đăng nhập thất bại!';
            }
        } catch (error) {
            console.error('Lỗi:', error);
            errorMessage.textContent = 'Có lỗi xảy ra trong quá trình đăng nhập.';
        }
    });
});