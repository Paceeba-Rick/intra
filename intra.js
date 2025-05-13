// MoMo Number for Payment
const momoNumber = "0533125955"; // MoMo number
const deliveryFee = 6.00; // Delivery fee in Ghana cedis

backend_url = "https://api.intragh.africa/"
// Orders array to store all user orders
const orders = [];

console.log(orders)

// Admin credentials

// Save orders to Local Storage
function saveOrdersToLocalStorage() {
    localStorage.setItem("orders", JSON.stringify(orders));
}

// Load orders from Local Storage
function loadOrdersFromLocalStorage() {
    // Make GET request to fetch orders
    fetch(backend_url + 'orders/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            
            orders.push(...data.data); // Load orders into the array
            // updateAdminDashboard(); // Update the display
        })
        .catch(error => {
            console.error('Error loading orders:', error);
        });
    // if (storedOrders) {
    //     const parsedOrders = JSON.parse(storedOrders);
    //     orders.push(...parsedOrders); // Load into the orders array
    // }
}

// Handle Order Submission
function handleOrderSubmission(event) {
    event.preventDefault();

    const spinner = document.getElementById("spinner");
    spinner.style.display = "block";

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
    // Prepare the order data
    const orderData = {
        name: name,
        block: block,
        room_number: room,
        description: description,
        amount: amount
    };

    // Send order to backend
    fetch(backend_url + 'orders/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        spinner.style.display = "none";

        
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
            <strong>Amount:</strong> GH₵${amount.toFixed(2)}<br>
            <strong>Delivery Fee:</strong> GH₵${deliveryFee.toFixed(2)}<br>
            <strong>Total Amount:</strong> GH₵${totalAmount.toFixed(2)}<br>
            <strong>Block:</strong> ${block}<br>
            <strong>Room:</strong> ${room}<br><br>
            Please send the payment of <strong>GH₵${totalAmount.toFixed(2)}</strong> to the following MoMo number:<br>
            <strong>${momoNumber}</strong><br>.pls Reference your <strong>name</strong>.
        `;

        // Clear the form
        document.getElementById("orderForm").reset();

        // Set timeout to hide confirmation
        setTimeout(() => {
            responseMessage.style.display = "none";
        }, 3600000);

        // Update Admin Dashboard
        // updateAdminDashboard();
    })
    .catch(error => {
        spinner.style.display = "none";
        console.error('Error submitting order:', error);
        alert('Failed to submit order. Please try again.');
    });
   
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
            <strong>Block:</strong> ${order.block}, <strong>Room:</strong> ${order.room_number}<br>
            <strong>Description:</strong> ${order.description}<br>
            <strong>Amount:</strong> GH₵${order.amount.toFixed(2)}<br>
            <button onclick="deleteOrder(${order.pk})">Delete</button>
        `;
        ordersList.appendChild(li);
    });
}

// Load orders when the page loads
document.addEventListener("DOMContentLoaded", () => {
    loadOrdersFromLocalStorage();
    // updateAdminDashboard();
});

// Handle Admin Login
function handleAdminLogin(event) {
    event.preventDefault();

    const spinner = document.getElementById("spinner_1");
    spinner.style.display = "block";

    const username = document.getElementById("admin-username").value;
    const password = document.getElementById("admin-password").value;

        // Create form data
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        // Make POST request
        fetch(backend_url + "auth/login", {
            method: 'POST',
            body: formData
        })
        .then(response => {
            spinner.style.display = "none";
            if (response.status === 200) {
                switchToAdminView();
            } else if (response.status === 401) {
                document.getElementById("login-error").style.display = "block";
            } else {
                console.error('Unexpected status:', response.status);
                document.getElementById("login-error").style.display = "block";
            }
        })
        .catch(error => {
            spinner.style.display = "none";
            console.error('Error:', error);
            document.getElementById("login-error").style.display = "block";
        });
 
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
