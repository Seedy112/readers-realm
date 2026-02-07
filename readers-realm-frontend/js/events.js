document.addEventListener("DOMContentLoaded", async function () {
    const toggleEventFormBtn = document.getElementById("toggleEventForm");
    const eventFormContainer = document.getElementById("eventFormContainer");
    const eventForm = document.getElementById("eventForm");
    const eventsList = document.getElementById("eventsList");
    const pastEventsList = document.getElementById("pastEvents");

    const token = localStorage.getItem("token");

    // Show/Hide Event Form
    toggleEventFormBtn.addEventListener("click", function () {
        eventFormContainer.style.display = eventFormContainer.style.display === "none" ? "block" : "none";
    });

    // Fetch Events from Backend
    async function fetchEvents() {
        try {
            const response = await fetch("http://localhost:5000/api/events");
            const events = await response.json();

            eventsList.innerHTML = "<h3>Upcoming Events</h3>";
            pastEventsList.innerHTML = "<h3>Past Events</h3>";

            const currentDate = new Date();

            events.forEach(event => {
                const eventDate = new Date(event.event_date);
                const eventDiv = document.createElement("div");
                eventDiv.classList.add("event-item");
                eventDiv.innerHTML = `
                    <h3 class="event-title" data-id="${event.event_id}">${event.title}</h3>
                    <p>${eventDate.toDateString()}</p>
                    <p>📍 ${event.location}</p>
                `;
                eventDiv.addEventListener("click", function () {
                    window.location.href = `event-details.html?event_id=${event.event_id}`;
                });

                if (eventDate >= currentDate) {
                    eventsList.appendChild(eventDiv);
                } else {
                    pastEventsList.appendChild(eventDiv);
                }
            });
        } catch (error) {
            console.error("Error fetching events:", error);
            eventsList.innerHTML = "<p>Error loading events.</p>";
        }
    }

    await fetchEvents();

    // Handle Event Form Submission
    eventForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (!token) {
            alert("You must be logged in to create an event.");
            return;
        }

        const title = document.getElementById("eventTitle").value.trim();
        const date = document.getElementById("eventDate").value;
        const description = document.getElementById("eventDescription").value.trim();
        const location = document.getElementById("eventLocation").value.trim();

        if (!title || !date || !description || !location) {
            alert("Please fill in all fields.");
            return;
        }

        const eventData = { title, event_date: date, description, location };

        try {
            const response = await fetch("http://localhost:5000/api/events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(eventData)
            });

            if (response.ok) {
                alert("Event created successfully!");
                eventForm.reset();
                eventFormContainer.style.display = "none";
                await fetchEvents(); // Refresh event list
            } else {
                alert("Error creating event.");
            }
        } catch (error) {
            console.error("Error submitting event:", error);
        }
    });
});
