// admin_users.js

document.addEventListener('DOMContentLoaded', function() {

    // Hàm view user
    function viewUser(userId) {
      window.location.href = `Account.php?id=${userId}`;
    }
  
    // Hàm khóa/mở người dùng
    function toggleBlockUser(userId) {
      fetch(`toggle_block_user.php?id=${userId}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            // Cập nhật giao diện người dùng sau khi thành công
            alert(data.message); // Hiển thị thông báo thành công
  
            // Tải lại bảng người dùng để hiển thị trạng thái mới (tùy chọn)
            searchAndFilter();
  
          } else {
            alert(data.message); // Hiển thị thông báo lỗi
          }
        })
        .catch(error => {
          console.error('Lỗi:', error);
          alert('Có lỗi xảy ra khi thực hiện thao tác.'); // Thông báo lỗi chung
        });
    }
  
    // Hàm tìm kiếm và lọc người dùng
    function searchAndFilter() {
      // Lấy giá trị từ input và select
      const searchTerm = document.getElementById('search-input').value.toLowerCase();
      const statusFilter = document.getElementById('status-filter').value;
      const sexFilter = document.getElementById('sex-filter').value;
  
      // Tạo URL để gửi yêu cầu AJAX
      const url = `search_users.php?search=${searchTerm}&status=${statusFilter}&sex=${sexFilter}`;
  
      // Sử dụng fetch API để gửi yêu cầu AJAX
      fetch(url)
        .then(response => response.text())
        .then(data => {
          // Thay thế nội dung của tbody bằng kết quả trả về
          document.querySelector('#user-table tbody').innerHTML = data;
        })
        .catch(error => {
          console.error('Lỗi:', error);
        });
    }
  
    // Gắn các hàm vào window để có thể gọi từ HTML (nếu cần)
    window.viewUser = viewUser;
    window.toggleBlockUser = toggleBlockUser;
    window.searchAndFilter = searchAndFilter;
  
    // Gọi searchAndFilter ban đầu để tải dữ liệu
    searchAndFilter();
  });