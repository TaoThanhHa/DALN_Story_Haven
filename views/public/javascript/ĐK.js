document.addEventListener('DOMContentLoaded', function() { 
    const registerForm = document.getElementById('registerForm');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error'); // Lấy element hiển thị lỗi mật khẩu
    const confirmPasswordError = document.getElementById('confirm-password-error'); // Lấy element hiển thị lỗi xác nhận mật khẩu

    // Hàm hiển thị lỗi
    function showError(element, message) {
        element.textContent = message;
        element.style.display = 'block';
    }

    // Hàm ẩn lỗi
    function hideError(element) {
        element.style.display = 'none';
    }

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Ẩn tất cả các thông báo lỗi trước mỗi lần kiểm tra
        hideError(emailError);
        hideError(passwordError);
        hideError(confirmPasswordError);

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        let isValid = true; // Biến cờ để theo dõi trạng thái hợp lệ của form

        // Validate email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!emailRegex.test(email)) {
            showError(emailError, 'Email không hợp lệ. Vui lòng sử dụng email @gmail.com.');
            isValid = false;
        }

        // Validate password strength
        // Điều kiện: Tối thiểu 8 ký tự, ít nhất 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$/;
        if (!passwordRegex.test(password)) {
            showError(passwordError, 'Mật khẩu không hợp lệ. Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt.');
            isValid = false;
        }

        // Kiểm tra password khớp với confirmPassword
        if (password !== confirmPassword) {
            showError(confirmPasswordError, 'Mật khẩu và nhập lại mật khẩu không khớp!');
            isValid = false;
        }

        // Nếu có bất kỳ lỗi nào, dừng quá trình submit
        if (!isValid) {
            return;
        }

        // Nếu tất cả đều hợp lệ, tiến hành gửi dữ liệu
        const data = {
            username: name,
            email: email,
            phone: phone,
            password: password
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

            if (response.ok && result.success) {
                alert(result.message || 'Đăng ký thành công!');
                window.location.href = '/login';
            } else {
                // Kiểm tra nếu lỗi từ server là do mật khẩu không đủ mạnh (nếu server cũng có validation tương tự)
                if (result.error && result.error.includes("password")) { // Điều kiện này cần khớp với lỗi trả về từ server
                     showError(passwordError, result.error);
                } else {
                    alert(result.error || 'Có lỗi xảy ra khi đăng ký!');
                }
            }
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Có lỗi xảy ra trong quá trình đăng ký.');
        }
    });
});