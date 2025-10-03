const STORYID = new URLSearchParams(window.location.search).get('storyId');
//Lấy nội trên web khi người dùng nhập
const storyTitle = document.getElementById('story-title');

storyTitle.addEventListener('input', function () {
    const newTitle = storyTitle.innerText;
    storyTitle.textContent = newTitle;
});

// Ngăn người dùng nhập xuống dòng khi nhấn phím Enter
storyTitle.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const text = this.innerText.trim();
        this.innerText = text;
    }
});

// Thêm nội dung vào phần tử div khi trang web được tải
document.addEventListener('DOMContentLoaded', function () {
    const storyEditor = document.querySelector('.story-editor');
    const newParagraph = document.createElement('p');

    storyEditor.appendChild(newParagraph);
    getMaxChapter(STORYID);

});
function getMaxChapter(storyId) {
    fetch(`/api/chapters/max?storyId=${storyId}`)
        .then(res => res.json())
        .then(data => {
            const chapters = data.maxChapterNumber;
            let chapter = document.getElementById('chapter-number');
            chapter.textContent = `Chương ${chapters ? chapters + 1 : 1}`;
        })
        .catch(err => console.error(err));
}

//Nút lưu
async function saveStory() {
    const storyTitle = document.getElementById('story-title').innerText;
    const storyContent = document.querySelector('.story-editor').innerText;
    const chapterNumber = document.getElementById('chapter-number').textContent;

    console.log(storyTitle, storyContent);
    const response = await fetch(`/api/chapter/new?storyId=${STORYID}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: storyTitle, content: storyContent, chapter_number: chapterNumber.split(' ')[1] })
    });
    if (response.ok) {
        alert("Bạn đã lưu thành công!");
        window.location.reload();
    } else {
        alert("Lưu thất bài!");
    }
}



