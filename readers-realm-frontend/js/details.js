// Function to get query parameter value from URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Get the book_id from URL
const bookId = getQueryParam("book_id");

if (!bookId) {
    alert("Book not found! Redirecting to catalog...");
    window.location.href = "catalog.html"; // Redirect if no book ID is found
} else {
    fetchBookDetails(bookId);
}

// Function to fetch book details from backend
async function fetchBookDetails(bookId) {
    try {
        const response = await fetch(`http://localhost:5000/api/books/${bookId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch book details");
        }

        const book = await response.json();

        // Update the HTML with book details
        document.getElementById("bookTitle").textContent = book.title;
        document.getElementById("bookCover").src = book.cover_image || "Images/placeholder.jpg";
        document.getElementById("bookCover").alt = book.title;
        document.getElementById("bookAuthor").textContent = book.author || "Unknown";
        document.getElementById("bookGenre").textContent = book.genre || "N/A";
        document.getElementById("bookYear").textContent = book.publication_year || "N/A";
        document.getElementById("bookDescription").textContent = book.description || "No description available.";

        // Set the "Buy on Amazon" link (dummy link for now)
        document.getElementById("buyLink").href = `https://www.amazon.com/s?k=${encodeURIComponent(book.title)}`;

    } catch (error) {
        console.error("Error fetching book details:", error);
        document.querySelector(".details-container").innerHTML = "<h2>Book details not found.</h2>";
    }
}
