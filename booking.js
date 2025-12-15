// ===============================
// GET TOUR DATA FROM URL
// ===============================
const params = new URLSearchParams(window.location.search);
const tour = params.get("tour");
const price = parseInt(params.get("price")) || 0;

// ===============================
// DISPLAY TOUR INFO
// ===============================
document.getElementById("tourName").textContent = tour || "Selected Tour";
document.getElementById("tourPrice").textContent = price;

// ===============================
// TOTAL AMOUNT CALCULATION
// ===============================
const personsInput = document.getElementById("persons");
const totalAmount = document.getElementById("totalAmount");

function updateTotal() {
    const persons = parseInt(personsInput.value) || 1;
    totalAmount.textContent = price * persons;
}

updateTotal();
personsInput.addEventListener("input", updateTotal);

// ===============================
// FORM SUBMISSION
// ===============================
document.getElementById("bookingForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const date = document.getElementById("tourDate").value;
    const persons = parseInt(personsInput.value);
    const payment = document.getElementById("paymentMethod").value;
    const total = price * persons;

    // ===============================
    // EMAIL TEMPLATE PARAMETERS
    // ===============================
    const templateParams = {
        tour: tour,
        name: name,
        email: email,
        phone: phone,
        date: date,
        persons: persons,
        total: total,
        payment: payment
    };

    // ===============================
    // SEND EMAIL
    // ===============================
    emailjs.send(
        "service_nxiu1d6",      // 🔁 YOUR SERVICE ID
        "template_y4d34u8",     // 🔁 YOUR TEMPLATE ID
        templateParams
    )
    .then(function () {

        // ===============================
        // SAVE TO FIREBASE DATABASE
        // ===============================
        return db.collection("bookings").add({
            tour: tour,
            name: name,
            email: email,
            phone: phone,
            date: date,
            persons: persons,
            total: total,
            payment: payment,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    })
    .then(function () {

        alert(
            "✅ Booking Confirmed!\n\n" +
            "Tour: " + tour + "\n" +
            "Persons: " + persons + "\n" +
            "Total Amount: Rs. " + total + "\n\n" +
            "A confirmation email has been sent to your email.\n" +
            "This amount has been deducted from your bank account."
        );

        document.getElementById("bookingForm").reset();
        updateTotal();
    })
    .catch(function (error) {
        alert("❌ Something went wrong.\n\n" + (error.message || "Please try again."));
        console.error("Error:", error);
    });
});
