document.addEventListener("DOMContentLoaded", function () {
    const discussionTitle = document.getElementById("discussionTitle");
    const discussionDescription = document.getElementById("discussionDescription");
    const commentsList = document.getElementById("commentsList");
    const commentForm = document.getElementById("commentForm");

    // Check if user is logged in
    const token = localStorage.getItem("token");
    let username = null;

    if (token) {
        fetch("http://localhost:5000/api/auth/verify-token", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => response.json())  
        .then(data => {
            if (data.username) {
                username = data.username;
            } else {
                localStorage.removeItem("token");
            }
        })
        .catch(() => localStorage.removeItem("token"));
    }

    // Load selected discussion
    const discussion = JSON.parse(localStorage.getItem("currentDiscussion"));

    if (!discussion) {
        discussionTitle.textContent = "Discussion Not Found";
        discussionDescription.textContent = "";
        return;
    }

    discussionTitle.textContent = discussion.title;
    discussionDescription.textContent = discussion.content;

    // Load comments
    async function loadComments(discussion_id) {
        commentsList.innerHTML = "";
        try {
            const response = await fetch(`http://localhost:5000/api/discussions/${discussion_id}/comments`);
            const comments = await response.json();
    
            comments.forEach(comment => {
                const commentDiv = document.createElement("div");
                commentDiv.classList.add("comment");
                commentDiv.innerHTML = `<p><strong>${comment.username}:</strong> ${comment.content}</p>`;
                commentsList.appendChild(commentDiv);
            });
        } catch (error) {
            console.error("Error loading comments:", error);
        }
    }
    
    loadComments(discussion.discussion_id);

    // Handle comment submission
    commentForm.addEventListener("submit", async function (event) {
        event.preventDefault();
    
        if (!username) {
            alert("You must be logged in to post a comment!");
            window.location.href = "login.html";
            return;
        }
    
        const content = document.getElementById("commentText").value;
        const discussion_id = JSON.parse(localStorage.getItem("currentDiscussion")).discussion_id;
    
        try {
            const response = await fetch(`http://localhost:5000/api/discussions/${discussion_id}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ content })
            });
    
            if (response.ok) {
                document.getElementById("commentText").value = "";
                loadComments(discussion_id);
            } else {
                alert("Failed to post comment.");
            }
        } catch (error) {
            console.error("Error posting comment:", error);
        }
    });
    
});
