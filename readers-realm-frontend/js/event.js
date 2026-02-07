document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get("event_id");

    if (!eventId) {
        document.getElementById("eventTitle").textContent = "Event Not Found";
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/events/${eventId}`);
        if (!response.ok) throw new Error("Event not found");

        const event = await response.json();

        document.getElementById("eventTitle").textContent = event.title;
        document.getElementById("eventDateTime").textContent = `📅 Date: ${new Date(event.event_date).toLocaleString()}`;
        document.getElementById("eventLocation").textContent = `📍 Location: ${event.location}`;
        document.getElementById("eventDescription").textContent = event.description;
    } catch (error) {
        console.error("Error fetching event details:", error);
        document.getElementById("eventTitle").textContent = "Error loading event details.";
    }
});
