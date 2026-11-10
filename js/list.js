
// CHECK LOGGED-IN USER
const currentUname = localStorage.getItem("groceryKoCurrentUser");

if (!currentUname) {
    window.location.href = "login.html";
} else {
    document.getElementById("welcomeMessage").textContent =
        "Hello, " + currentUname + "!";
}

// GET HTML ELEMENTS
const itemForm = document.getElementById("itemForm");
const groceryList = document.getElementById("groceryList");
const emptyMessage = document.getElementById("emptyMessage");
const itemCount = document.getElementById("itemCount");
const clearButton = document.getElementById("clearButton");
const logoutButton = document.getElementById("logoutButton");

// GET AND SAVE ITEMS
function getAllItems() {
    return JSON.parse(localStorage.getItem("groceryKoItems")) || [];
}

function getUserItems() {
    return getAllItems().filter(item => item.owner === currentUname);
}

function saveItems(items) {
    localStorage.setItem("groceryKoItems", JSON.stringify(items));
}

// DISPLAY GROCERY ITEMS
function renderItems() {
    const items = getUserItems();
    groceryList.innerHTML = "";

    items.forEach(item => {
        const li = document.createElement("li");
        li.className = "grocery-item" + (item.completed ? " completed" : "");

        const info = document.createElement("div");
        info.className = "item-info";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "item-check";
        checkbox.checked = item.completed;
        checkbox.setAttribute("aria-label", "Mark " + item.name + " as completed");

        checkbox.addEventListener("change", () => {
            updateItem(item.id, { completed: checkbox.checked });
        });

        const name = document.createElement("span");
        name.className = "item-name";
        name.textContent = item.name;

        const quantity = document.createElement("span");
        quantity.className = "item-quantity";
        quantity.textContent = "Qty: " + item.quantity;

        info.append(checkbox, name, quantity);

        const actions = document.createElement("div");
        actions.className = "item-actions";

        const edit = document.createElement("button");
        edit.type = "button";
        edit.className = "small-action";
        edit.textContent = "Edit";
        edit.onclick = () => editItem(item);

        const del = document.createElement("button");
        del.type = "button";
        del.className = "small-action delete";
        del.textContent = "Delete";
        del.onclick = () => deleteItem(item.id);

        actions.append(edit, del);
        li.append(info, actions);
        groceryList.appendChild(li);
    });

    emptyMessage.hidden = items.length > 0;
    itemCount.textContent = items.length + (items.length === 1 ? " item" : " items");
}

// ADD GROCERY ITEM
itemForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("item_name").value.trim();
    const quantityInput = document.getElementById("item_qty");
    const quantity = Number(quantityInput.value);

    if (!name || !Number.isInteger(quantity) || quantity < 1) {
        alert("Please enter a valid item name and quantity.");
        return;
    }

    const items = getAllItems();

    items.push({
        id: Date.now().toString(),
        owner: currentUname,
        name: name,
        quantity: quantity,
        completed: false
    });

    saveItems(items);
    itemForm.reset();
    quantityInput.value = 1;
    renderItems();
});

// UPDATE ITEM
function updateItem(id, changes) {
    const items = getAllItems().map(item =>
        item.id === id && item.owner === currentUname
            ? { ...item, ...changes }
            : item
    );

    saveItems(items);
    renderItems();
}

// EDIT ITEM
function editItem(item) {
    const newName = prompt("Update item name:", item.name);
    if (newName === null) return;

    const name = newName.trim();

    if (!name) {
        alert("Item name cannot be empty.");
        return;
    }

    const newQty = prompt("Update quantity:", item.quantity);
    if (newQty === null) return;

    const quantity = Number(newQty);

    if (!Number.isInteger(quantity) || quantity < 1) {
        alert("Enter a valid quantity.");
        return;
    }

    updateItem(item.id, { name, quantity });
}

// DELETE ITEM
function deleteItem(id) {
    const items = getAllItems().filter(item =>
        !(item.id === id && item.owner === currentUname)
    );

    saveItems(items);
    renderItems();
}

// CLEAR GROCERY LIST
clearButton.addEventListener("click", function() {
    if (!getUserItems().length) return;

    if (confirm("Are you sure you want to clear your entire grocery list?")) {
        const items = getAllItems().filter(item =>
            item.owner !== currentUname
        );

        saveItems(items);
        renderItems();
    }
});

// LOG OUT
logoutButton.addEventListener("click", function() {
    localStorage.removeItem("groceryKoCurrentUser");
    window.location.href = "login.html";
});

// DISPLAY SAVED ITEMS
renderItems();
