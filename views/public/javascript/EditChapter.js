const CHAPTERID = new URLSearchParams(window.location.search).get('chapterId');

document.addEventListener('DOMContentLoaded', function () {
    console.log("Chapter ID:", CHAPTERID);
    if (CHAPTERID) {
        fetchChapterData(CHAPTERID);
    } else {
        console.error('Chapter ID is missing in URL parameters.');
        alert('Chapter ID không tồn tại!'); // Thêm thông báo cho người dùng
        // Có thể redirect về trang danh sách chapter hoặc trang chủ
    }
});
let CHAPTER_NUMBER = null;

async function fetchChapterData(chapterId) {
    try {
        const response = await fetch(`/api/chapter/${chapterId}`);
        const data = await response.json();

        document.getElementById('story-title').innerText = data.title;
        document.querySelector('.story-editor').innerText = data.content;
        document.getElementById('chapter-number').textContent = `Chương ${data.chapter_number}`;

        CHAPTER_NUMBER = data.chapter_number; // lưu lại để update
    } catch (error) {
        console.error('Error fetching chapter data:', error);
    }
}

async function saveChapter() {
    const title = document.getElementById('story-title').innerText.trim();
    const content = document.querySelector('.story-editor').innerText.trim();

    if (!title || !content) {
        return alert('Vui lòng nhập tiêu đề và nội dung!');
    }

    try {
        const response = await fetch(`/api/chapter/${CHAPTERID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title, 
                content, 
                chapter_number: CHAPTER_NUMBER // dùng lại số chương cũ
            })
        });

        const data = await response.json();
        if (data.success) {
            alert('Lưu chương thành công!');
        } else {
            alert('Lỗi khi lưu chương!');
        }
    } catch (error) {
        console.error('Error saving chapter:', error);
    }
}
