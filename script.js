var total = 0;
var cartItemsList = document.getElementById("cartItems");
var totalDisplay = document.getElementById("total");
var form = document.getElementById("bookingForm");
var myCart = new Map();

window.onload = function () {
    var buttons = document.getElementsByClassName("service-btn");

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].onclick = function () {
            var serviceName = this.getAttribute('data-name');
            var servicePrice = parseInt(this.getAttribute('data-price'));

            if (myCart.has(serviceName)) {
                removeFromCart(serviceName, servicePrice, this);
            } else {
                addToCart(serviceName, servicePrice, this);
            }
        };
    }

    form.onsubmit = doBooking;
};

function addToCart(name, price, btn) {
    var listItem = document.createElement("li");
    listItem.setAttribute("data-name", name);
    listItem.className = "flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200";
    listItem.innerHTML = `
                <span class="font-semibold text-gray-800">${name}</span> 
                <span class="font-bold text-blue-600">₹${price}</span>
            `;

    cartItemsList.appendChild(listItem);
    total = total + price;
    totalDisplay.innerHTML = total;
    myCart.set(name, { price: price, element: listItem });

    btn.innerHTML = "- Remove Item";
    btn.className = "service-btn bg-red-100 border-2 border-red-400 px-6 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-red-200";
}

function removeFromCart(name, price, btn) {
    var cartItem = myCart.get(name);
    if (cartItem == null) return;

    cartItem.element.parentNode.removeChild(cartItem.element);
    total = total - price;
    totalDisplay.innerHTML = total;
    myCart.delete(name);

    btn.innerHTML = "+ Add Item";
    btn.className = "service-btn bg-gray-100 border-2 border-blue-400 px-6 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-blue-100 hover:border-blue-500";
}

function doBooking(event) {
    event.preventDefault();

    var customerName = form.name.value;
    var customerEmail = form.email.value;
    var customerPhone = form.phone.value;

    var messageBox = document.getElementById("statusMsg");
    messageBox.classList.remove("hidden");

    if (customerName == "" || customerEmail == "" || customerPhone == "") {
        messageBox.innerHTML = "Please fill all the fields first!";
        messageBox.className = "status-message error";
        return;
    }

    if (total == 0) {
        messageBox.innerHTML = "Please add at least one service to your cart!";
        messageBox.className = "status-message error";
        return;
    }

    var orderList = "";
    myCart.forEach(function (item, serviceName) {
        orderList = orderList + serviceName + " - ₹" + item.price + "\n";
    });

    var emailTitle = "Your Laundry Booking - Total ₹" + total;
    var emailText = "Hello " + customerName + ",\n\n" +
        "Here are your booking details:\n" +
        orderList +
        "Total Amount: ₹" + total + "\n" +
        "Phone: " + customerPhone + "\n\n" +
        "Thank you for choosing FreshFold Laundry! We'll call you soon to confirm pickup.";

    window.location = "mailto:" + customerEmail +
        "?subject=" + encodeURIComponent(emailTitle) +
        "&body=" + encodeURIComponent(emailText);

    messageBox.innerHTML = "🎉 Booking sent to " + customerEmail + "! Check your email.";
    messageBox.className = "status-message success";

    // Reset form and cart
    form.reset();
    cartItemsList.innerHTML = "";
    total = 0;
    totalDisplay.innerHTML = "0";
    myCart.clear();

    var allServiceButtons = document.getElementsByClassName("service-btn");
    for (var j = 0; j < allServiceButtons.length; j++) {
        allServiceButtons[j].innerHTML = "+ Add Item";
        allServiceButtons[j].className = "service-btn bg-gray-100 border-2 border-blue-400 px-6 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-blue-100 hover:border-blue-500";
    }

    setTimeout(function () {
        messageBox.classList.add("hidden");
    }, 5000);
}
