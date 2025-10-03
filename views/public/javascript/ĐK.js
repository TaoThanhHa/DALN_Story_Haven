document.addEventListener('DOMContentLoaded', function() { 
    const registerForm = document.getElementById('registerForm');
    const emailError = document.getElementById('email-error');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validate email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!emailRegex.test(email)) {
            emailError.style.display = 'block';
            return;
        } else {
            emailError.style.display = 'none';
        }

        // Kiểm tra password khớp với confirmPassword
        if (password !== confirmPassword) {
            alert("Mật khẩu và nhập lại mật khẩu không khớp!");
            return;
        }

        // Tạo object dữ liệu
        const data = {
            username: name, // Đổi name thành username để khớp với API
            email: email,
            phone: phone,
            password: password
            // Không cần confirmPassword trong API, chỉ kiểm tra ở client
        };

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data) 
            });

            const result = await response.json();

            if (response.ok && result.success) { // Kiểm tra response.ok thay vì status
                alert(result.message || 'Đăng ký thành công!');
                window.location.href = '/login'; // Chuyển đến trang đăng nhập
            } else {
                alert(result.error || 'Có lỗi xảy ra khi đăng ký!');
            }
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Có lỗi xảy ra trong quá trình đăng ký.');
        }
    });
});