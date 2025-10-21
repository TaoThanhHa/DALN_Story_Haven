let STORYID = null;

// Preview ảnh bìa
document.getElementById('image-upload').addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById('preview-image').setAttribute('src', e.target.result);
    };
    reader.readAsDataURL(file);
  }
});

// Validation functions
function validateTitle(title) {
  if (!title || title.trim() === '') return 'Tiêu đề không được để trống';
  if (title.length < 3) return 'Tiêu đề phải dài hơn 3 ký tự';
  if (title.length > 100) return 'Tiêu đề không được dài quá 100 ký tự';
  return null;
}

function validateDescription(description) {
  if (!description || description.trim() === '') return 'Mô tả không được để trống';
  if (description.length < 10) return 'Mô tả phải dài hơn 10 ký tự';
  if (description.length > 1000) return 'Mô tả không được dài quá 1000 ký tự';
  return null;
}

function getSelectedCategories() {
  const checkedBoxes = document.querySelectorAll("#category-list input[type='checkbox']:checked");
  return Array.from(checkedBoxes).map(cb => cb.value);
}

function validateCategories(categories) {
  if (!categories || categories.length === 0) return 'Vui lòng chọn ít nhất 1 thể loại';
  return null;
}

function validateImage(fileInput) {
  const file = fileInput.files[0];
  if (!file) return 'Vui lòng chọn ảnh bìa';
  const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!validTypes.includes(file.type)) return 'Chỉ chấp nhận định dạng JPG, PNG hoặc GIF';
  if (file.size > 5 * 1024 * 1024) return 'Kích thước ảnh không được vượt quá 5MB';
  return null;
}

// Lưu truyện
// Lưu truyện
async function saveStory() {
  try {
    const title = document.getElementById('story-title').value;
    const description = document.getElementById('story-content').value;
    const categories = getSelectedCategories();
    const status = document.querySelector('#status-select').value;
    const imageInput = document.getElementById('image-upload');

    // Validate
    const titleError = validateTitle(title);
    const descError = validateDescription(description);
    const catError = validateCategories(categories);
    const imageError = validateImage(imageInput);

    if (titleError || descError || catError || imageError) {
      alert([titleError, descError, catError, imageError].filter(e => e).join('\n'));
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', categories.join(', '));
    formData.append('status', status);
    formData.append('thumbnail', imageInput.files[0]);
    formData.append('control', '0'); // 🔹 mặc định là bản thảo

    const response = await fetch('http://localhost:3000/api/story/new', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Có lỗi xảy ra khi lưu truyện');

    STORYID = result.storyId;
    alert('Truyện đã được lưu dưới dạng bản thảo!');

    // 🔹 Chuyển hướng sang trang chỉnh sửa
    window.location.href = `/html/Edit_story.html?id=${STORYID}`;
  } catch (error) {
    console.error('Error saving story:', error);
    alert(error.message || 'Có lỗi xảy ra khi lưu truyện');
  }
}


// Default
document.querySelector('.story').style.display = 'block';
