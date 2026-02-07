let currentIndex = 0;

function updateCarousel() {
    const carousel = document.querySelector(".carousel");
    const bookCards = document.querySelectorAll(".book-card");
    const totalBooks = bookCards.length;
    const translateXValue = -currentIndex * 100 + "%";
    carousel.style.transform = `translateX(${translateXValue})`;
}

function nextSlide() {
    const totalBooks = document.querySelectorAll(".book-card").length;
    currentIndex = (currentIndex + 1) % totalBooks;
    updateCarousel();
}

function prevSlide() {
    const totalBooks = document.querySelectorAll(".book-card").length;
    currentIndex = (currentIndex - 1 + totalBooks) % totalBooks;
    updateCarousel();
}

setInterval(nextSlide, 5000);
