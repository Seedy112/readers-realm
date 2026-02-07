document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You need to be logged in to view your profile.");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/users/profile", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch profile");
        }

        const user = await response.json();

        document.getElementById("fullname").textContent = user.fullname;
        document.getElementById("username").textContent = user.username;
        document.getElementById("email").textContent = user.email;
        document.getElementById("phone").textContent = user.phone;
        document.getElementById("dob").textContent = new Date(user.dob).toDateString();
        document.getElementById("gender").textContent = user.gender;
        document.getElementById("favgenre").textContent = user.favgenre || "Not specified";
        document.getElementById("about").textContent = user.about || "Not specified";
        document.getElementById("newsletter").textContent = user.newsletter ? "Subscribed" : "Not Subscribed";
        document.getElementById("createdAt").textContent = new Date(user.created_at).toLocaleDateString();
    } catch (error) {
        console.error("Error loading profile:", error);
        alert("Could not load profile data.");
    }
});
