// Get references to DOM elements
const searchInput = document.getElementById("searchBar");
const filterSelect = document.getElementById("genreFilter");
const bookGrid = document.getElementById("bookGrid");

// Fetch books from the backend
async function fetchBooks() {
    try {
        const response = await fetch("http://localhost:5000/api/books"); // Adjust URL if needed
        if (!response.ok) {
            throw new Error("Failed to fetch books");
        }
        const books = await response.json();
        displayBooks(books);
    } catch (error) {
        console.error("Error fetching books:", error);
    }
}

// Function to display books in the catalog
function displayBooks(books) {
    bookGrid.innerHTML = ""; // Clear previous content
    books.forEach(book => {
        const bookCard = document.createElement("div");
        bookCard.classList.add("book-card");
        bookCard.setAttribute("data-category", book.genre); // Store genre for filtering

        bookCard.innerHTML = `
            <img src="${book.cover_image}" alt="${book.title}" />
            <h3><a href="details.html?book_id=${book.book_id}">${book.title}</a></h3>
        `;

        bookGrid.appendChild(bookCard);
    });
}

// Function to filter books based on search and genre
function filterBooks() {
    const searchText = searchInput.value.toLowerCase();
    const selectedGenre = filterSelect.value;
    const bookCards = document.querySelectorAll(".book-card");

    bookCards.forEach(card => {
        const title = card.querySelector("h3 a").textContent.toLowerCase();
        const genre = card.getAttribute("data-category");

        const matchesSearch = title.includes(searchText);
        const matchesGenre = selectedGenre === "all" || genre === selectedGenre;

        card.style.display = matchesSearch && matchesGenre ? "block" : "none";
    });
}

// Event listeners for search and filter
searchInput.addEventListener("input", filterBooks);
filterSelect.addEventListener("change", filterBooks);

// Load books when the page loads
fetchBooks();
