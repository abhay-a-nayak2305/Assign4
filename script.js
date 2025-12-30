let total = 0;
const cartItems = document.getElementById("cartItems");
const totalEl = document.getElementById("total");

// Track selected items
const selectedItems = new Map();

document.querySelectorAll(".service-btn").forEach(button => {
    button.addEventListener("click", () => {
        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        if (selectedItems.has(name)) {
            removeItem(name, price, button);
        } else {
            addItem(name, price, button);
        }
    });
});

function addItem(name, price, button) {
    // Add to cart UI
    const li = document.createElement("li");
    li.setAttribute("data-name", name);
    li.innerHTML = `
        <span>${name}</span>
        <span>₹${price}</span>
    `;

    cartItems.appendChild(li);

    // Update total
    total += price;
    totalEl.textContent = total;

    // Track item
    selectedItems.set(name, { price, li });

    // Change button state
    button.innerHTML = `<i class="fa-solid fa-minus"></i> Remove Item`;
    button.classList.add("remove");
}

function removeItem(name, price, button) {
    const item = selectedItems.get(name);
    if (!item) return;

    // Remove from UI
    item.li.remove();

    // Update total
    total -= price;
    totalEl.textContent = total;

    // Remove from map
    selectedItems.delete(name);

    // Reset button
    button.innerHTML = `<i class="fa-solid fa-plus"></i> Add Item`;
    button.classList.remove("remove");
}
