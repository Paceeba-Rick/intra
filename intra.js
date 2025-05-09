// MoMo Number for Payment
const momoNumber = "0533125955"; // MoMo number
const deliveryFee = 6.00; // Delivery fee in Ghana cedis

// Orders array to store all user orders
const orders = [];

// Admin credentials
const adminCredentials = {
    username: "Ceeba",
    password: "malanyi@100"
};

// Save orders to Local Storage
function saveOrdersToLocalStorage() {
    localStorage.setItem("orders", JSON.stringify(orders));
}

// Load orders from Local Storage
function loadOrdersFromLocalStorage() {
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
        const parsedOrders = JSON.parse(storedOrders);
        orders.push(...parsedOrders); // Load into the orders array
    }
}

// Handle Order Submission
function handleOrderSubmission(event) {
    event.preventDefault();

    // Get form values
    const name = document.getElementById("name").value;
    const block = document.getElementById("block").value;
    const room = document.getElementById("room").value;
    const description = document.getElementById("description").value;
    const amountInput = document.getElementById("amount").value;

    // Validate input
    const amount = parseFloat(amountInput);
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount greater than zero.");
        return; // Stop further execution
    }

    // Calculate total amount (including delivery fee)
    const totalAmount = amount + deliveryFee;

    // Create an order object
    const order = { id: Date.now(), name, block, room, description, amount, totalAmount };
    orders.push(order);

    // Display confirmation message
    const responseMessage = document.getElementById("response-message");
    responseMessage.style.display = "block";
    responseMessage.innerHTML = `
        Thank you, <strong>${name}</strong>!<br>
        Your order has been received.<br>
        <strong>Description:</strong> ${description}<br>
        <strong>Food Amount:</strong> GH₵${amount.toFixed(2)}<br>
        <strong>Delivery Fee:</strong> GH₵${deliveryFee.toFixed(2)}<br>
        <strong>Total Amount:</strong> GH₵${totalAmount.toFixed(2)}<br>
        <strong>Block:</strong> ${block}<br>
        <strong>Room:</strong> ${room}<br><br>
        Please send the payment of <strong>GH₵${totalAmount.toFixed(2)}</strong> to the following MoMo number:<br>
        <strong>${momoNumber}</strong><br>Reference your name.
    `;

    // Clear the form
    document.getElementById("orderForm").reset();

    // Set a timeout to hide the confirmation message after 1 hour (3600000 ms)
    setTimeout(() => {
        responseMessage.style.display = "none";
    }, 3600000); // 1 hour in milliseconds

    // Update Admin Dashboard
    updateAdminDashboard();
}

// Delete an order
function deleteOrder(orderId) {
    // Find the index of the order in the array
    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex > -1) {
        orders.splice(orderIndex, 1); // Remove the order from the array
        saveOrdersToLocalStorage(); // Update Local Storage
        updateAdminDashboard(); // Refresh the admin dashboard
    }
}

// Update Admin Dashboard
function updateAdminDashboard() {
    saveOrdersToLocalStorage(); // Save orders whenever the dashboard is updated
    const ordersList = document.getElementById("orders-list");
    ordersList.innerHTML = ""; // Clear existing list

    orders.forEach((order, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${index + 1}. Name:</strong> ${order.name}<br>
            <strong>Block:</strong> ${order.block}, <strong>Room:</strong> ${order.room}<br>
            <strong>Description:</strong> ${order.description}<br>
            <strong>Food Amount:</strong> GH₵${order.amount.toFixed(2)}<br>
            <strong>Delivery Fee:</strong> GH₵${deliveryFee.toFixed(2)}<br>
            <strong>Total Amount:</strong> GH₵${order.totalAmount.toFixed(2)}<br>
            <button onclick="deleteOrder(${order.id})">Delete</button>
        `;
        ordersList.appendChild(li);
    });
}

// Load orders when the page loads
document.addEventListener("DOMContentLoaded", () => {
    loadOrdersFromLocalStorage();
    updateAdminDashboard();
});

// Handle Admin Login
function handleAdminLogin(event) {
    event.preventDefault();

    const username = document.getElementById("admin-username").value;
    const password = document.getElementById("admin-password").value;

    if (username === adminCredentials.username && password === adminCredentials.password) {
        switchToAdminView();
    } else {
        document.getElementById("login-error").style.display = "block";
    }
}

// Switch Views
function switchToUserView() {
    document.getElementById("user-view").style.display = "block";
    document.getElementById("admin-login-view").style.display = "none";
    document.getElementById("admin-view").style.display = "none";
}

function switchToAdminLoginView() {
    document.getElementById("user-view").style.display = "none";
    document.getElementById("admin-login-view").style.display = "block";
    document.getElementById("admin-view").style.display = "none";
}

function switchToAdminView() {
    document.getElementById("user-view").style.display = "none";
    document.getElementById("admin-login-view").style.display = "none";
    document.getElementById("admin-view").style.display = "block";
    updateAdminDashboard();
}

// Logout Admin
function logoutAdmin() {
    switchToAdminLoginView();
}

// Event Listeners
document.getElementById("orderForm").addEventListener("submit", handleOrderSubmission);
document.getElementById("adminLoginForm").addEventListener("submit", handleAdminLogin);
document.getElementById("user-view-btn").addEventListener("click", switchToUserView);
document.getElementById("admin-view-btn").addEventListener("click", switchToAdminLoginView);
document.getElementById("logout-btn").addEventListener("click", logoutAdmin);

// Initialize App
switchToUserView();
