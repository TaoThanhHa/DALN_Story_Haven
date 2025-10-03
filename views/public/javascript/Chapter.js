//Thanh menu
const menuToggle = document.querySelector('.fa');
const menuContainer = document.querySelector('.menu');

menuToggle.addEventListener('click', () => {
    menuContainer.classList.toggle('open');
});

//Đổi màu vote
const Vote = document.getElementById('Vote');
Vote.addEventListener('click', function () {
    Vote.classList.toggle('clicked');
});

//Bình luận
function getRandomAvatar() {
    return `https://i.pravatar.cc/50?u=${Math.random()}`;
}

function getRandomUsername() {
    return `Người dùng ${Math.floor(Math.random() * 100)}`;
}

// Xử lý sự kiện submit form bình luận chính
document.getElementById("commentForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const commentText = document.getElementById("commentInput").value.trim();
    if (commentText === "") return;


    const comment = createCommentElement(commentText);

    document.getElementById("comments").prepend(comment);

    document.getElementById("commentInput").value = "";
});

// Hàm tạo phần tử bình luận
function createCommentElement(commentText) {
    const comment = document.createElement("li");
    comment.classList.add("comment");
    comment.innerHTML = `
    <div class="comments-detail">
        <div class="avt">
            <img src="https://i.pravatar.cc/50?u=${Math.random()}" alt="Avatar">
            <div class="nick-name">Người dùng ${Math.floor(Math.random() * 100)}</div>
        </div>
        <div class="comments-info">${commentText}</div>
        <div class="comments-item">
            <span class="comment-date">${new Date().toLocaleString()}</span>
            <div class="comments-symbol">
                <div class="reply-btn"><i class="fas fa-reply"></i> (<span class="reply-count">0</span>)</div>
                <div class="delete-btn" style="color: red; cursor: pointer;"><i class="fas fa-trash"></i></div>
            </div>
        </div>
        <div class="replies" style="display: none;"></div>
        <div class="reply-form" style="display: none;">
            <form id="commentForm" class="row">
                <div class="col-10"><textarea type="text" class="reply-input" placeholder="Nhập bình luận của bạn..." required></textarea></div>
                <div class="col-2"><button class="send-reply"><i class="fas fa-paper-plane"></i></button></div>
            </form>
        </div>
    </div>
`;

    const replyBtn = comment.querySelector(".reply-btn");
    const replyCount = comment.querySelector(".reply-count");
    const repliesContainer = comment.querySelector(".replies");
    const replyForm = comment.querySelector(".reply-form");
    const replyInput = replyForm.querySelector(".reply-input");
    const deleteBtn = comment.querySelector(".delete-btn");

    deleteBtn.addEventListener("click", function () {
        if (confirm("Bạn có chắc chắn muốn xóa bình luận này không?")) {
            comment.remove();
        }
    });

    replyBtn.addEventListener("click", function () {
        replyForm.style.display = replyForm.style.display === "none" ? "block" : "none";
    });

    replyForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const replyText = replyInput.value.trim();
        if (replyText === "") return;

        const reply = createReplyElement(replyText);

        repliesContainer.appendChild(reply);

        replyForm.style.display = "none";

        replyCount.textContent = parseInt(replyCount.textContent) + 1;

        repliesContainer.style.display = "block";

        replyInput.value = "";
    });

    return comment;
}

// Hàm tạo phần tử phản hồi
function createReplyElement(replyText) {
    const reply = document.createElement("div");
    reply.classList.add("comment", "reply");
    reply.innerHTML = `
    <div class="comments-detail">
        <div class="avt">
            <img src="${getRandomAvatar()}" alt="Avatar">
            <div class="nick-name">${getRandomUsername()}</div>
        </div>
        <div class="comments-info">${replyText}</div>
        <div class="comments-item">
            <span class="comment-date">${new Date().toLocaleString()}</span>
            <div class="comments-symbol">
                <div class="reply-btn"><i class="fas fa-reply"></i> (<span class="reply-count">0</span>)</div>
                <div class="delete-btn" style="color: red; cursor: pointer;"><i class="fas fa-trash"></i></div>
            </div>
        </div>
        <div class="replies" style="display: none;"></div>
        <div class="reply-form" style="display: none;">
            <form class="reply-form-inner row">
                <div class="col-10"><textarea type="text" class="reply-input" placeholder="Nhập phản hồi của bạn..." required></textarea></div>
                <div class="col-2"><button type="submit" class="send-reply"><i class="fas fa-paper-plane"></i></button></div>
            </form>
        </div>
    </div>
`;

    const replyBtn = reply.querySelector(".reply-btn");
    const replyCount = reply.querySelector(".reply-count");
    const repliesContainer = reply.querySelector(".replies");
    const replyForm = reply.querySelector(".reply-form");
    const replyInput = replyForm.querySelector(".reply-input");
    const deleteBtn = reply.querySelector(".delete-btn");

    deleteBtn.addEventListener("click", function () {
        if (confirm("Bạn có chắc chắn muốn xóa bình luận này không?")) {
            reply.remove();
        }
    });

    replyBtn.addEventListener("click", function () {
        replyForm.style.display = replyForm.style.display === "none" ? "block" : "none";
    });

    replyForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const replyText = replyInput.value.trim();
        if (replyText === "") return;

        const replyToReply = createReplyElement(replyText);

        repliesContainer.appendChild(replyToReply);

        replyForm.style.display = "none";

        replyCount.textContent = parseInt(replyCount.textContent) + 1;

        repliesContainer.style.display = "block";

        replyInput.value = "";
    });

    return reply;
}
let CHAPTERCURRENT = 0;
let STORYID = 0;
let BACKCHAPTER = 0;
let NEXTCHAPTER = 0;
document.addEventListener("DOMContentLoaded", function () {
    const pathSegments = window.location.pathname.split("/");

    if (pathSegments.length >= 4) {
        const storyId = pathSegments[2];
        const chapterId = pathSegments[4];
        console.log(storyId, chapterId);

        if (storyId && chapterId) {
            fetchStoryChapterData(storyId, chapterId);
        }
    }
});
const backChapter = () => {

    if (CHAPTERCURRENT == 1) {
        alert("Chương truyện đầu tiên");
        return;
    }
    fetchStoryChapterData(STORYID, BACKCHAPTER);
}

const nextChapter = () => {
    fetchStoryChapterData(STORYID, NEXTCHAPTER);
}


const fetchStoryChapterData = (storyId, chapterId) => {
    CHAPTERCURRENT = chapterId;
    STORYID = storyId;
    fetch(`/api/chapter/${chapterId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert("Không tìm thấy chương truyện!");
                return;
            }
            fillContentChapter(data);
        })
    fetch(`/api/story/${storyId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert("Không tìm thấy chương truyện!");
                return;
            }
            fillStoryChapterData(data.story, data.chapters);
            setBackNextChapter(data.chapters);
        })
        .catch(error => console.error("Lỗi khi lấy dữ liệu:", error));
};
const setBackNextChapter = (chapters) => {
    chapters.forEach((chapter, index) => {
        if (chapter.id == CHAPTERCURRENT) {
            if (index > 0) {
                BACKCHAPTER = chapters[index - 1].id;
            }
            if (index < chapters.length - 1) {
                NEXTCHAPTER = chapters[index + 1].id;
            }
        }
    });
}

const fillContentChapter = (chapter) => {
    const chapterTitleElement = document.querySelector(".tieu-de");
    if (chapterTitleElement) {
        chapterTitleElement.textContent = `Chương ${chapter.chapter_number}: ${chapter.title}`;
    }
    const contentContainer = document.querySelector(".noi-dung");
    if (contentContainer) {
        contentContainer.innerHTML = "";
        const paragraphs = chapter.content.split("\n").filter(p => p.trim() !== "");
        paragraphs.forEach(paragraph => {
            const div = document.createElement("div");
            div.textContent = paragraph;
            contentContainer.appendChild(div);
        });
    }
};
const fillStoryChapterData = (story, chapter) => {
   
    document.title = `${story.title}`;

    const storyNameElement = document.querySelector(".story-name a");
    if (storyNameElement) {
        storyNameElement.textContent = story.title;
        storyNameElement.href = `/story/${story.id}`;
    }

    const chapterListContainer = document.querySelector(".box-chap");
    if (chapterListContainer) {
        chapterListContainer.innerHTML = "";
        chapter.forEach(chap => {
            console.log(chap);
    
            const chapLink = document.createElement("a");
            chapLink.href = `/story/${story.id}/chapter/${chap.id}`;
            chapLink.textContent = `CHAP ${chap.chapter_number}: ${chap.title}`;
            chapLink.style.backgroundColor = "#f5f5f5";
            chapLink.style.color = "#333";

            if (CHAPTERCURRENT == chap.chapter_number) {
                chapLink.style.backgroundColor = "#333";
                chapLink.style.color = "#fff";
            }
            chapLink.style.display = "block";
            chapLink.style.padding = "10px 15px";
            chapLink.style.margin = "5px 0";
            chapLink.style.borderRadius = "5px";
            chapLink.style.textDecoration = "none";
            chapLink.style.fontWeight = "bold";
            chapLink.style.transition = "background 0.3s, color 0.3s";
    
           
            chapLink.addEventListener("mouseenter", () => {
                chapLink.style.backgroundColor = "#333";
                chapLink.style.color = "#fff";
            });
            chapLink.addEventListener("mouseleave", () => {
                chapLink.style.backgroundColor = "#f5f5f5";
                chapLink.style.color = "#333";
            });
    
            chapterListContainer.appendChild(chapLink);
        });
    }
    
};
