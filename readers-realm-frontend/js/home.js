document.addEventListener("DOMContentLoaded", function () {
    // Load featured books
    loadFeaturedBooks(); 

    // Load Navbar
    fetch("navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-container").innerHTML = data;
            updateNavbar(); // Call function to update login/logout
        })
        .catch(error => console.error("Error loading navbar:", error));

    function updateNavbar() {
        const loginBtn = document.getElementById("auth-link");
        const logoutBtn = document.getElementById("logout-btn");

        const token = localStorage.getItem("token");

        if (token) {
            loginBtn.textContent = "Profile";
            loginBtn.href = "profile.html";
            logoutBtn.style.display = "inline";
        }

        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("token");
            alert("Logged out successfully!");
            window.location.href = "home.html";
        });
    }
});

async function loadFeaturedBooks() {
    const carousel = document.querySelector(".carousel");

    try {
        const response = await fetch("http://localhost:5000/api/books");
        const books = await response.json();

        const featuredBooks = books.slice(0, 6); // Show first 6

        featuredBooks.forEach(book => {
            const bookCard = document.createElement("div");
            bookCard.classList.add("book-card");

            bookCard.innerHTML = `
                <img src="${book.cover_image || 'Images/ThelastAnimal.jpg'}" alt="${book.title}" />
                <h3><a href="details.html?book_id=${book.book_id}">${book.title}</a></h3>
            `;

            carousel.appendChild(bookCard);
        });
    } catch (err) {
        console.error("Failed to load featured books:", err);
    }
}
