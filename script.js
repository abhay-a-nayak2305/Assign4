var total = 0;
var cartItemsList = document.getElementById("cartItems");
var totalDisplay = document.getElementById("total");
var form = document.getElementById("bookingForm");
var myCart = new Map();

window.onload = function() {
    var buttons = document.getElementsByClassName("service-btn");
    
    for(var i = 0; i < buttons.length; i++) {
        buttons[i].onclick = function() {
            var serviceName = this.getAttribute('data-name');
            var servicePrice = parseInt(this.getAttribute('data-price'));
            
            if(myCart.has(serviceName)) {
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
    listItem.innerHTML = "<span>" + name + "</span> <span>₹" + price + "</span>";
    
    cartItemsList.appendChild(listItem);
    total = total + price;
    totalDisplay.innerHTML = total;
    myCart.set(name, {price: price, element: listItem});
    
    btn.innerHTML = "- Remove Item";
    btn.className = "service-btn remove";
}

function removeFromCart(name, price, btn) {
    var cartItem = myCart.get(name);
    if(cartItem == null) return;
    
    cartItem.element.parentNode.removeChild(cartItem.element);
    total = total - price;
    totalDisplay.innerHTML = total;
    myCart.delete(name);
    
    btn.innerHTML = "+ Add Item";
    btn.className = "service-btn";
}

function doBooking(event) {
    event.preventDefault();
    
    var customerName = form.name.value;
    var customerEmail = form.email.value;
    var customerPhone = form.phone.value;
    
    var messageBox = document.getElementById("statusMsg");
    if(messageBox == null) {
        messageBox = document.createElement("div");
        messageBox.id = "statusMsg";
        messageBox.className = "status-message";
        form.appendChild(messageBox);
    }
    
    if(customerName == "" || customerEmail == "" || customerPhone == "") {
        messageBox.innerHTML = "Please fill all the fields first!";
        messageBox.className = "status-message error";
        return;
    }
    
    if(total == 0) {
        messageBox.innerHTML = "Please add at least one service to your cart!";
        messageBox.className = "status-message error";
        return;
    }
    
    var orderList = "";
    myCart.forEach(function(item, serviceName) {
        orderList = orderList + serviceName + " - ₹" + item.price + "\n";
    });
    
    var emailTitle = "Your Laundry Booking - Total ₹" + total;
    var emailText = "Hello " + customerName + ",\n\n" +
                   "Here are your booking details:\n" +
                   orderList +
                   "Total Amount: ₹" + total + "\n" +
                   "Phone: " + customerPhone + "\n\n" +
                   "Thank you for choosing us! We'll call you soon.";
    
    window.location = "mailto:" + customerEmail + 
                     "?subject=" + encodeURIComponent(emailTitle) +
                     "&body=" + encodeURIComponent(emailText);
    
    messageBox.innerHTML = "Booking sent to " + customerEmail + "! Check your email.";
    messageBox.className = "status-message success";
    
    form.reset();
    cartItemsList.innerHTML = "";
    total = 0;
    totalDisplay.innerHTML = "0";
    myCart.clear();
    
    var allServiceButtons = document.getElementsByClassName("service-btn");
    for(var j = 0; j < allServiceButtons.length; j++) {
        allServiceButtons[j].innerHTML = "+ Add Item";
        allServiceButtons[j].className = "service-btn";
    }
    
    setTimeout(function() {
        messageBox.innerHTML = "";
        messageBox.className = "status-message";
    }, 5000);
}
