// DOM Elements
const tabs = document.querySelectorAll(".tab");
const signupLink = document.getElementById("signup-link");
const formTitle = document.getElementById("form-title");
const loginForm = document.getElementById("login-form");

// Function to show message
function showMessage(message, type = "success") {
    const container = document.getElementById("message-container");
    container.textContent = message;
    container.className = `message-container ${type} visible`;

    setTimeout(() => {
        container.className = "message-container hidden";
    }, 3000);
}

// Form Configurations
const formConfigs = {
    user: {
        fields: [
            { type: "email", id: "user-email", placeholder: "Email", required: true },
            { type: "password", id: "user-password", placeholder: "Password", required: true },
        ],
        submitText: "Log in",
        onSubmit: validateUserLogin,
    },
    staff: {
        fields: [
            { type: "text", id: "staff-name", placeholder: "Staff Name", required: true },
            { type: "password", id: "staff-password", placeholder: "Password", required: true },
        ],
        submitText: "Log in",
        onSubmit: validateStaffLogin,
    },
    signup: {
        title: "Sign Up",
        fields: [
            { type: "text", id: "fullname", placeholder: "Full Name", required: true },
            { type: "email", id: "signup-email", placeholder: "Email", required: true },
            { type: "password", id: "signup-password", placeholder: "Password", required: true },
            { type: "password", id: "confirm-password", placeholder: "Confirm Password", required: true },
        ],
        submitText: "Sign up",
        onSubmit: validateSignup,
    },
};

// Initialize Tabs
tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        const tabType = tab.dataset.type;
        switchForm(tabType);
        updateActiveTab(tab);
    });
});

// Handle "Sign up" link click
if (signupLink) {
    signupLink.addEventListener("click", (event) => {
        event.preventDefault(); // Prevents clicking on a link
        switchForm("signup");
        updateActiveTab(null); // Reset active tabs
    });
}

// Switch Form
function switchForm(type) {
    const config = formConfigs[type];
    if (!config) return;

    formTitle.textContent = config.title || "Log In";
    loginForm.innerHTML = config.fields
        .map(
            (field) =>
                `<input type="${field.type}" id="${field.id}" placeholder="${field.placeholder}" ${field.required ? "required" : ""} />`
        )
        .join("");
    loginForm.innerHTML += `<button type="submit">${config.submitText}</button>`;
    loginForm.onsubmit = config.onSubmit;

    // Show or hide the caption based on the form type
    const caption = document.querySelector(".login-form p");
    if (type === "signup") {
        caption.style.display = "none"; // Hide the caption for signup
    } else {
        caption.style.display = ""; // Show the caption for other forms
    }
}

// Update Active Tab
function updateActiveTab(activeTab) {
    tabs.forEach((tab) => tab.classList.remove("active"));
    if (activeTab) {
        activeTab.classList.add("active");
    }
}

// Initialize default form
window.addEventListener("DOMContentLoaded", () => {
    switchForm("user"); // Set the default user form
    updateActiveTab(document.getElementById("user-tab")); // Activate the “User” tab
});

// Staff Login Validation
function validateStaffLogin(event) {
    event.preventDefault();

    const staffNameInput = document.getElementById("staff-name").value.trim();
    const password = document.getElementById("staff-password").value.trim();

    // Get stored staff data from localStorage
    const staffData = JSON.parse(localStorage.getItem('staff')) || [];

    // Check if staff name and password are valid
    if (!staffNameInput) {
        showMessage("Staff Name is required.", "error");
        return false;
    }
    if (!password) {
        showMessage("Password is required.", "error");
        return false;
    }

    // Normalize staff name for comparison (case-insensitive)
    const normalizedStaffName = staffNameInput.toLowerCase();

    // Check if the entered staff name exists
    const staffExists = staffData.some(staff => staff.name.toLowerCase() === normalizedStaffName);

    if (!staffExists) {
        showMessage("Invalid Staff Name.", "error");
        return false;
    }

    if (password !== "1111") {
        showMessage("Invalid Password.", "error");
        return false;
    }

    showMessage("Staff Login Successful!", "success");
    setTimeout(() => window.location.href = "admin/dashboard.html", 1000);
    return true;
}

// Key for LocalStorage
const USERS_KEY = "registeredUsers";

// Handle "Sign up" process
function validateSignup(event) {
    event.preventDefault();

    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();

    if (!fullname) {
        showMessage("Full Name is required.", "error");
        return false;
    }
    if (!validateEmail(email)) {
        showMessage("Invalid email address.", "error");
        return false;
    }
    if (!password) {
        showMessage("Password is required.", "error");
        return false;
    }
    if (password !== confirmPassword) {
        showMessage("Passwords do not match.", "error");
        return false;
    }

    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    if (users.some((user) => user.email === email)) {
        showMessage("Email is already registered.", "error");
        return false;
    }

    users.push({ fullname, email, password });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    showMessage("Signup Successful!", "success");
    setTimeout(() => switchForm("user"), 100);

    // Додаємо активний клас для табу "User"
    const userTab = document.getElementById("user-tab");
    updateActiveTab(userTab);

    return true;
}

// Handle "Log in" process
function validateUserLogin(event) {
    event.preventDefault();

    const email = document.getElementById("user-email").value.trim();
    const password = document.getElementById("user-password").value.trim();

    if (!validateEmail(email)) {
        showMessage("Invalid email address.", "error");
        return false;
    }
    if (!password) {
        showMessage("Password is required.", "error");
        return false;
    }

    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
        showMessage("Invalid email or password.", "error");
        return false;
    }

    showMessage(`Welcome, ${user.fullname}!`, "success");
    setTimeout(() => (window.location.href = "user/home.html"), 1000);
    return true;
}

// Utility function to validate email format
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Carousel Logic
const slides = document.querySelectorAll('.slide');
if (slides.length) {
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    showSlide(currentSlide);

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    setInterval(nextSlide, 3000);
}

// General function for rendering elements
function renderItems(container, data, type) {
    container.innerHTML = data.map((item, index) =>
        `<div class="${type}-card" data-index="${index}">
            <h3>${item.name}</h3>
            <p>${type === 'staff' ? `Role: ${item.role}` : `Type: ${item.type}`}</p>
            <button class="delete-button">Delete</button>
        </div>`
    ).join("");

    // Adding an event listener for the “Delete” button
    const deleteButtons = container.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const card = event.target.closest(`.${type}-card`);
            const index = card.dataset.index;

            // Removing an item from an array
            data.splice(index, 1);

            // Updating data in localStorage
            localStorage.setItem(type, JSON.stringify(data));

            // Re-rendering elements
            renderItems(container, data, type);
        });
    });
}

// Function for adding a new employee
function addStaff() {
    const staffName = document.getElementById('staff-name').value;
    const staffRole = document.getElementById('staff-role').value;

    // Check for completeness of fields
    if (!staffName || !staffRole) {
        showMessage("Please fill in both name and role.", "warning");
        return;
    }

    // Get data from localStorage or initialize an empty array
    let staffData = JSON.parse(localStorage.getItem('staff')) || [];

    // Create a new staff
    const newStaffMember = {
        name: staffName,
        role: staffRole
    };

    // Adding a new staff to the array
    staffData.push(newStaffMember);

    // Saving the updated array to localStorage
    localStorage.setItem('staff', JSON.stringify(staffData));

    // Clear input fields
    document.getElementById('staff-name').value = '';
    document.getElementById('staff-role').value = '';

    // Update the display
    renderStaff();
}

// Function for displaying employees
function renderStaff() {
    const staffContainer = document.querySelector('.staff-section');
    const staffData = JSON.parse(localStorage.getItem('staff')) || [];
    renderItems(staffContainer, staffData, 'staff');
}

// Function for downloading data
function loadData() {
    let staffData = JSON.parse(localStorage.getItem('staff'));
    let reservationData = JSON.parse(localStorage.getItem('reservations')) || [];

    // If data is not found in localStorage, load from JSON files
    if (!staffData || staffData.length === 0) {
        return fetch("../json/staff.json")
            .then(response => response.ok ? response.json() : Promise.reject("Failed to load staff data"))
            .then(data => {
                localStorage.setItem('staff', JSON.stringify(data));
                staffData = data;
                return staffData;
            });
    }

    return Promise.all([staffData, reservationData]);
}

// Statistics update
function updateCheckedInGuests(reservationData) {
    const approvedGuests = reservationData.filter(reservation => reservation.status === 'Paid');
    return approvedGuests.length;
}

// Calling functions after loading the DOM
document.addEventListener("DOMContentLoaded", () => {
    loadData()
        .then(([staffData, reservationData]) => {
            const staffSection = document.querySelector(".staff-section");
            const staffElement = document.getElementById("staff");
            const totalReservationsElement = document.getElementById("total-reservations");
            const guestsCheckedInElement = document.getElementById("guests-checked-in");

            // Displaying staff
            if (staffSection) {
                renderItems(staffSection, staffData, 'staff');
            }

            // Statistics update
            if (staffElement) {
                staffElement.textContent = staffData.length;
            }
            if (totalReservationsElement) {
                totalReservationsElement.textContent = reservationData.length;
            }

            if (guestsCheckedInElement) {
                guestsCheckedInElement.textContent = updateCheckedInGuests(reservationData);
            }
        })
});

// Booking Modal Logic
const roomButtons = document.querySelectorAll(".book-room");
const bookingModal = document.getElementById("booking-modal");

roomButtons.forEach(button => {
    button.addEventListener("click", () => {
        bookingModal.style.display = "flex";
    });
});

document.querySelector(".modal .close")?.addEventListener("click", () => {
    bookingModal.style.display = "none";
});

window.addEventListener("click", event => {
    if (event.target === bookingModal) {
        bookingModal.style.display = "none";
    }
});

// Function to handle form submission in home.html
document.addEventListener('DOMContentLoaded', function () {
    const submitButton = document.querySelector('.submit');
    const bookingModal = document.getElementById('booking-modal');
    const closeButton = document.querySelector('.close');

    // Capture form data and store it
    submitButton.addEventListener('click', function (event) {
        event.preventDefault();

        // Get form values from home.html
        const fullName = document.getElementById('full-name').value;
        const email = document.getElementById('email').value;
        const country = document.getElementById('country').value;
        const phone = document.getElementById('phone').value;
        const roomType = document.getElementById('room-type').value;
        const bed = document.getElementById('bed').value;
        const meal = document.getElementById('meal').value;
        const checkIn = document.getElementById('check-in').value;
        const checkOut = document.getElementById('check-out').value;

        // Check for filling in all fields
        if (!fullName || !email || !country || !phone || !roomType || !bed || !meal || !checkIn || !checkOut) {
            // Find the container for the error message
            const errorElement = document.getElementById("error-message");

            // Set the text of the message
            errorElement.textContent = "Please fill in all the fields.";

            // Додаємо класи для показу повідомлення
            errorElement.classList.add("show", "warning");

            // Show the error message
            return;
        }

        // Create reservation object
        const reservation = {
            fullName,
            email,
            country,
            phone,
            roomType,
            bed,
            meal,
            checkIn,
            checkOut,
            status: "Pending" // Status of the reservation
        };

        // Get existing reservations from localStorage (or initialize as an empty array if none)
        let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        reservations.push(reservation);

        // Save updated reservations list back to localStorage
        localStorage.setItem('reservations', JSON.stringify(reservations));

        // Close the booking modal after submission
        bookingModal.style.display = 'none';

        // Optional: Reset form fields
        document.getElementById('full-name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('country').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('room-type').value = '';
        document.getElementById('bed').value = '';
        document.getElementById('meal').value = '';
        document.getElementById('check-in').value = '';
        document.getElementById('check-out').value = '';
    });

    // Close the modal when clicking the close button
    closeButton.addEventListener('click', function () {
        bookingModal.style.display = 'none';
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const reservationsBody = document.getElementById('reservations-body');

    // Load reservations from localStorage and display them in the table
    const loadReservations = () => {
        const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        reservationsBody.innerHTML = ''; // Clear any existing rows

        // Populate the table with reservation data
        reservations.forEach((reservation, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${reservation.fullName}</td>
                <td>${reservation.email}</td>
                <td>${reservation.country}</td>
                <td>${reservation.phone}</td>
                <td>${reservation.roomType}</td>
                <td>${reservation.bed}</td>
                <td>${reservation.meal}</td>
                <td>${reservation.checkIn}</td>
                <td>${reservation.checkOut}</td>
                <td>${reservation.status}</td>
                <td>
                    <button class="update-status">Approve</button>
                    <button class="delete-reservation">Delete</button>
                </td>
            `;
            reservationsBody.appendChild(row);
        });

        // Handle status update
        document.querySelectorAll('.update-status').forEach((button, index) => {
            button.addEventListener('click', () => {
                const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
                reservations[index].status = 'Approved'; // Update status to "Approved"
                localStorage.setItem('reservations', JSON.stringify(reservations));
                loadReservations(); // Refresh the table
            });
        });

        // Handle reservation deletion
        document.querySelectorAll('.delete-reservation').forEach((button, index) => {
            button.addEventListener('click', () => {
                let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
                reservations.splice(index, 1); // Remove reservation from array
                localStorage.setItem('reservations', JSON.stringify(reservations));
                loadReservations(); // Refresh the table
            });
        });
    };

    // Load reservations when page is loaded
    loadReservations();
});

document.addEventListener('DOMContentLoaded', function () {
    const paymentBody = document.getElementById('payment-body');

    // Load reservations from localStorage and display them in the payment table
    const loadPayments = () => {
        const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        paymentBody.innerHTML = ''; // Clear any existing rows

        reservations.forEach((reservation, index) => {
            // Calculate Room Rent and Meal Price
            let roomRent;
            let mealsPrice;
            let bedRate;
            const roomRates = {
                "Superior Room": 400,
                "Deluxe Room": 300,
                "Guest Room": 200,
                "Single Room": 100
            };
            const bedRates = {
                "Single": 20,
                "Double": 40,
                "Suite": 60
            };

            const mealRates = {
                "Breakfast": 20,
                "Half-board": 30,
                "Full-board": 50
            };

            roomRent = roomRates[reservation.roomType] || 0;
            mealsPrice = mealRates[reservation.meal] || 0;
            bedRate = bedRates[reservation.bed] || 0;

            // Calculate Total Bill (Room Rent + Meals Price)
            const totalBill = roomRent + mealsPrice + bedRate;

            // Create a new row for the table
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${reservation.fullName}</td>
                <td>${reservation.roomType}</td>
                <td>${reservation.bed}</td>
                <td>${reservation.checkIn}</td>
                <td>${reservation.checkOut}</td>
                <td>${reservation.meal}</td>
                <td>$${roomRent}</td>
                <td>$${mealsPrice}</td>
                <td>$${totalBill}</td>
                <td>
                    <button class="update-payment" data-index="${index}">Approve Payment</button>
                    <button class="delete-payment" data-index="${index}">Delete Payment</button>
                </td>
            `;
            paymentBody.appendChild(row);
        });

        // Handle payment approval
        document.querySelectorAll('.update-payment').forEach((button) => {
            button.addEventListener('click', (event) => {
                const index = event.target.getAttribute('data-index');
                const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
                const reservation = reservations[index];
                reservation.status = 'Paid'; // Update status to "Paid"
                localStorage.setItem('reservations', JSON.stringify(reservations));
                loadPayments(); // Refresh the table
            });
        });

        // Handle payment deletion
        document.querySelectorAll('.delete-payment').forEach((button) => {
            button.addEventListener('click', (event) => {
                const index = event.target.getAttribute('data-index');
                let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
                reservations.splice(index, 1); // Remove reservation from array
                localStorage.setItem('reservations', JSON.stringify(reservations));
                loadPayments(); // Refresh the table
            });
        });
    };

    // Load payment data when page is loaded
    loadPayments();
});

// Fetch the countries from the JSON file
fetch('../json/countries.json')
    .then(response => response.json())  // Parse the JSON response
    .then(data => {
        const selectElement = document.getElementById('country');  // Get the <select> element
        data.countries.forEach(country => {
            const option = document.createElement('option');  // Create an <option> element
            option.value = country;  // Set the value attribute
            option.textContent = country;  // Set the visible name of the option
            selectElement.appendChild(option);  // Append the <option> to the <select>
        });
    })
    .catch(error => {
        console.error('Error loading the countries JSON:', error);
    });

document.addEventListener('DOMContentLoaded', function () {
    const searchReservationInput = document.querySelector('.search-bar'); // Reservation search bar
    const searchPaymentInput = document.querySelector('.search-bar'); // Payment search bar

    // Function to filter table rows
    const filterTable = (tableId, searchInput) => {
        const table = document.querySelector(tableId);
        const searchText = searchInput.value.toLowerCase();
        const rows = table.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const rowText = row.textContent.toLowerCase();
            if (rowText.includes(searchText)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    };

    // Event listener for the Reservations search bar
    searchReservationInput.addEventListener('input', () => {
        filterTable('#reservations-body', searchReservationInput);
    });

    // Event listener for the Payments search bar
    searchPaymentInput.addEventListener('input', () => {
        filterTable('#payment-body', searchPaymentInput);
    });
});

// Add an event listener to the “Add Staff” button
document.querySelector('.add-button').addEventListener('click', addStaff);

// Initialize the display of staff when the page loads
document.addEventListener("DOMContentLoaded", renderStaff);

function sendMail() {
    let parms = {
        to_name: "Hotel Team",
        from_name: document.getElementById("name").value.trim(),
        from_email: document.getElementById("emailField").value.trim(),
        message: document.getElementById("message").value.trim()
    };

    // Validate form data
    if (!parms.from_name || !parms.from_email || !parms.message) {
        return;
    }

    // Disable the button to prevent multiple submissions
    const submitButton = document.querySelector('button[onclick="sendMail()"]');
    submitButton.disabled = true;

    // Send email via EmailJS
    emailjs.send('service_5n0gkkr', 'template_to3nmer', parms)
        .then(function(response) {
            console.log("SUCCESS!", response);

            // Clear the form after a successful submission
            document.getElementById("contactForm").reset();
        })
        .catch(function(error) {
            console.error("FAILED...", error);
        })
        .finally(function() {
            // Re-enable the submit button after processing
            submitButton.disabled = false;
        });
}