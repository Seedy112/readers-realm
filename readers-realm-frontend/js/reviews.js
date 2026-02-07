document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get("book_id");

    if (!bookId) {
        alert("No book selected.");
        return;
    }

    const reviewsList = document.getElementById("reviewsList");
    const bookTitleElement = document.querySelector(".book-title");
    const reviewForm = document.getElementById("reviewForm");
    const reviewerNameField = document.getElementById("reviewerName");

    let user = null;
    const token = localStorage.getItem("token");

    // Function to fetch logged-in user details
    async function fetchUser() {
        if (!token) return;
        try {
            const response = await fetch("http://localhost:5000/api/auth/verify-token", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                user = await response.json();
                reviewerNameField.value = user.username;  // Auto-fill username field
                reviewerNameField.disabled = true; // Prevent user from changing name
            }
        } catch (error) {
            console.error("Error verifying token:", error);
        }
    }

    // Fetch book details and reviews
    async function fetchReviews() {
        try {
            const bookResponse = await fetch(`http://localhost:5000/api/books/${bookId}`);
            const book = await bookResponse.json();
            bookTitleElement.textContent = book.title;

            const bookCoverElement = document.getElementById("bookCover");
            bookCoverElement.src = book.cover_image || "Images/placeholder.jpg";
            bookCoverElement.alt = book.title;

            const reviewsResponse = await fetch(`http://localhost:5000/api/reviews/${bookId}`);
            const reviews = await reviewsResponse.json();

            reviewsList.innerHTML = "<h3>User Reviews</h3>";
            if (reviews.length === 0) {
                reviewsList.innerHTML += "<p>No reviews yet. Be the first to review!</p>";
            } else {
                reviews.forEach(review => {
                    const reviewElement = document.createElement("div");
                    reviewElement.classList.add("review");
                    reviewElement.innerHTML = `<p><strong>${review.username}:</strong> ${"⭐".repeat(review.rating)} "${review.review_text}"</p>`;
                    reviewsList.appendChild(reviewElement);
                });
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
            reviewsList.innerHTML = "<p>Error loading reviews.</p>";
        }
    }

    await fetchUser();
    await fetchReviews();

    // Submit review
    reviewForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!user) {
            alert("Please log in to submit a review.");
            return;
        }

        const rating = document.getElementById("reviewRating").value;
        const reviewText = document.getElementById("reviewText").value.trim();

        if (!reviewText) {
            alert("Please enter your review.");
            return;
        }

        const reviewData = { book_id: bookId, rating, review_text: reviewText };

        try {
            const response = await fetch("http://localhost:5000/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(reviewData)
            });

            if (response.ok) {
                alert("Review submitted successfully!");
                document.getElementById("reviewForm").reset();
                await fetchReviews(); // Refresh reviews
            } else {
                alert("Error submitting review.");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    });
});
