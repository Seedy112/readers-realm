document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const messageError = document.getElementById("messageError");

    nameError.textContent = "";
    emailError.textContent = "";
    messageError.textContent = "";

    let valid = true;

    if (name === "") {
        nameError.textContent = "Name is required.";
        valid = false;
    }

    if (email === "") {
        emailError.textContent = "Email is required.";
        valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        emailError.textContent = "Enter a valid email address.";
        valid = false;
    }

    if (message === "") {
        messageError.textContent = "Message cannot be empty.";
        valid = false;
    }

    if (!valid) return;

    try {
        const res = await fetch("http://localhost:5000/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, message }),
        });

        const data = await res.json();

        if (data.success) {
            alert("Thank you! Your message has been sent.");
            document.getElementById("contactForm").reset();
        } else {
            alert("Error: " + data.error);
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        alert("Server error. Please try again later.");
    }
});
