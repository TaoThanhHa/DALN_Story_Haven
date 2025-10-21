document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Ngăn chặn submit mặc định

        const email = document.getElementById('user').value;
        const password = document.getElementById('pass').value;

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
                body: JSON.stringify(data)
            });

            const result = await response.json();
            console.log("Response JSON:", result);

            if (response.ok && result.success) {
                console.log("Login result:", result); // Debug xem có redirectUrl không
                alert('Đăng nhập thành công!');
                window.location.href = result.redirectUrl; // dùng đúng tên biến trả về
            } else {
                errorMessage.textContent = result.error || 'Đăng nhập thất bại!';
            }

        } catch (error) {
            console.error('Lỗi:', error);
            errorMessage.textContent = 'Có lỗi xảy ra trong quá trình đăng nhập.';
        }
    });
});
