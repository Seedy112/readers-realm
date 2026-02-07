async function validateForm(formType) {
    if (formType === 'register') {
        return await validateRegisterForm();
    } else if (formType === 'login') {
        return await validateLoginForm();
    }
}

async function validateRegisterForm() {
    let name = document.getElementById("fullname").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let password = document.getElementById("password").value.trim();
    let dob = document.getElementById("dob").value;
    let gender = document.querySelector('input[name="gender"]:checked')?.value;
    let favGenre = document.getElementById("favgenre").value;
    let about = document.getElementById("about").value.trim();
    let newsletter = document.getElementById("newsletter").checked ? 1 : 0;
    let username = document.getElementById("username").value.trim();

    // Validation checks
    if (!/^[a-zA-Z ]+$/.test(name)) return alert("Invalid Name: Only letters and spaces allowed.");
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) return alert("Invalid Email.");
    if (!/^\d{10}$/.test(phone)) return alert("Invalid Phone Number: Must be 10 digits.");
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) return alert("Invalid Password: Minimum 8 characters, at least one letter, one special character and one number.");
    if (!dob) return alert("Please select your date of birth.");
    if (!gender) return alert("Please select a gender.");
    if (!favGenre) return alert("Please select your favorite book genre.");
    if (about.length < 10) return alert("Please provide more details about yourself.");
    if (!username) return alert("Please enter a username.");

    console.log("Sending:", {
        fullname: name, 
        email, 
        phone, 
        password, 
        dob, 
        gender, 
        username,
        favgenre: favGenre, 
        about,
        newsletter
    });

    // Send API request to backend
    try {
        const response = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fullname: name, 
                email, 
                phone, 
                password, 
                dob, 
                gender, 
                username,
                favgenre: favGenre, 
                about,
                newsletter
            })
        });
        console.log("Fetch request completed. Status:", response.status);

        // Fix: Check for empty response before calling .json()
        let data = await response.json();
        console.log("Response Data:", data); 

        if (response.ok) {
            alert("Registration Successful! Redirecting to login...");
            window.location.href = "login.html";
        } else {
            alert(data.message || "Registration failed!");
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        alert("Error connecting to server.");
    }

    return false;
}

async function validateLoginForm() {
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();

    if (!username) return alert("Please enter your username.");
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) return alert("Invalid Password.");

    try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert("Login Successful!");
            localStorage.setItem("token", data.token); // Store JWT
            window.location.href = "home.html"; // Redirect to homepage
        } else {
            alert(data.message || "Login failed!");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error connecting to server.");
    }

    return false;
}
