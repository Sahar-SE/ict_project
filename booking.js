// ===============================
// GET TOUR DATA FROM URL
// ===============================
const params = new URLSearchParams(window.location.search);
const tour = params.get("tour");
const price = parseInt(params.get("price"));

// ===============================
// DISPLAY TOUR INFO
// ===============================
document.getElementById("tourName").textContent = tour;
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
// FORM SUBMISSION + EMAIL
// ===============================
document.getElementById("bookingForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const date = document.getElementById("tourDate").value;
    const persons = document.getElementById("persons").value;
    const payment = document.getElementById("paymentMethod").value;
    const total = price * persons;

    // ===============================
    // EMAIL TEMPLATE PARAMETERS
    // ===============================
    const templateParams = {
        tour: tour,
        name: name,
        email: email,      // EMAIL SENT TO USER
        phone: phone,
        date: date,
        persons: persons,
        total: total,
        payment: payment
    };

    // ===============================
    // SEND EMAIL USING EMAILJS
    // ===============================
    emailjs.send(
        "service_nxiu1d6",   // 🔴 replace
        "template_y4d34u8",  // 🔴 replace
        templateParams
    ).then(function () {

        alert(
            "✅ Booking Confirmed!\n\n" +
            "Tour: " + tour + "\n" +
            "Total Amount: Rs. " + total + "\n\n" +
            "This amount has been deducted from your bank account.\n\n" +
            "A confirmation email has been sent to your email address."
        );

        document.getElementById("bookingForm").reset();
        updateTotal();

    }).catch(function (error) {
        alert("❌ Failed to send booking email. Please try again.");
        console.error("EmailJS Error:", error);
    });
});
