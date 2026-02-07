document.addEventListener("DOMContentLoaded", async function () {
    const toggleDiscussionFormBtn = document.getElementById("toggleDiscussionForm");
    const discussionFormContainer = document.getElementById("discussionFormContainer");
    const discussionForm = document.getElementById("discussionForm");
    const discussionsList = document.getElementById("discussionsList");

    // Check if user is logged in
    const token = localStorage.getItem("token");
    let username = null;

    if (token) {
        try {
            const response = await fetch("http://localhost:5000/api/auth/verify-token", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.username) {
                username = data.username; // Store the username if valid
            } else {
                localStorage.removeItem("token"); // Remove invalid token
            }
        } catch (error) {
            console.error("Token verification failed:", error);
            localStorage.removeItem("token");
        }
    }

    // Prevent posting if user is not logged in
    toggleDiscussionFormBtn.addEventListener("click", function () {
        if (!username) {
            alert("You must be logged in to start a discussion!");
            window.location.href = "login.html";
            return;
        }
        discussionFormContainer.style.display = "block";
    });

    // Load discussions from localStorage
    async function loadDiscussions() {
        discussionsList.innerHTML = "";
        try {
            const response = await fetch("http://localhost:5000/api/discussions");
            const discussions = await response.json();
            
            console.log("Fetched discussions:", discussions); // Debugging log

            discussions.forEach(discussion => {
                if (!discussion.content) {
                    console.error("Missing content in discussion:", discussion);
                    return; // Skip if content is missing
                }

                const discussionDiv = document.createElement("div");
                discussionDiv.classList.add("discussion-item");
                discussionDiv.innerHTML = `
                    <h3 class="discussion-title" data-id="${discussion.discussion_id}">${discussion.title}</h3>
                    <p>${discussion.content ? discussion.content.substring(0, 100) + "..." : "No content available"}</p>
                    <p><strong>Posted by:</strong> ${discussion.username}</p>
                `;
                discussionDiv.addEventListener("click", function () {
                    localStorage.setItem("currentDiscussion", JSON.stringify(discussion));
                    window.location.href = "discussion.html";
                });
                discussionsList.appendChild(discussionDiv);
            });
        } catch (error) {
            console.error("Error loading discussions:", error);
        }
    }

    

    loadDiscussions();

    // Handle discussion form submission
    discussionForm.addEventListener("submit", async function (event) {
        event.preventDefault();
    
        if (!username) {
            alert("You must be logged in to post a discussion!");
            window.location.href = "login.html";
            return;
        }
    
        const title = document.getElementById("discussionTitle").value;
        const content = document.getElementById("discussionDescription").value;
    
        try {
            const response = await fetch("http://localhost:5000/api/discussions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ title, content })
            });
    
            if (response.ok) {
                alert("Discussion posted successfully!");
                discussionForm.reset();
                discussionFormContainer.style.display = "none";
                loadDiscussions();
            } else {
                alert("Failed to post discussion.");
            }
        } catch (error) {
            console.error("Error posting discussion:", error);
        }
    });    
});
