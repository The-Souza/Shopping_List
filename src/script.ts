interface ShoppingListItem {
    id: string;
    name: string;
    bought?: boolean;
}

const shoppingListForm = document.getElementById(
    "shopping-list-form"
) as HTMLFormElement;
const shoppingList = document.getElementById(
    "shopping-list"
) as HTMLUListElement;
const InputItem = document.getElementById("item") as HTMLInputElement;

const loadItems = (): ShoppingListItem[] => {
    const items = localStorage.getItem("items");
    return items ? JSON.parse(items) : [];
};

const saveItems = (items: ShoppingListItem[]): void => {
    localStorage.setItem("items", JSON.stringify(items));
};

const addItems = (name: string) => {
    const items = loadItems();
    if (items.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
        alert("This item is already in the list.");
        return;
    }
    const newItem: ShoppingListItem = {
        id: new Date().toISOString(),
        name,
    };
    items.push(newItem);
    saveItems(items);
};

const removeItem = (id: string) => {
    const items = loadItems();
    const updatedItems = items.filter((item) => item.id !== id);
    saveItems(updatedItems);
};

const editItem = (id: string, newName: string, bought?: boolean) => {
    const items = loadItems();
    const itemIndex = items.findIndex((item) => item.id === id);
    if (itemIndex !== -1) {
        items[itemIndex].name = newName;
        if (typeof bought !== "undefined") {
            items[itemIndex].bought = bought;
        }
        saveItems(items);
    }
};

const renderItems = () => {
    const items = loadItems();
    shoppingList.innerHTML = "";
    items.forEach((item) => {
        const li = document.createElement("li");
        li.className =
            "list-group-item d-flex justify-content-between align-items-center";

        li.innerHTML = `
            <span class="text-capitalize">${item.name}</span>
            <div class="d-flex justify-content-end align-items-center gap-2" aria-label="Mark as Purchased">
                <button class="btn-buy btn btn-sm">
                    <i class="bi bi-cash-coin fs-5"></i>
                </button>
                <button class="btn-delete btn btn-outline-danger btn-sm" aria-label="Remove Item">
                    <i class="bi bi-trash fs-5"></i>
                </button>
            </div>
        `;

        if (item.bought) {
            li.classList.add("bought");
        }

        const deleteBtn = li.querySelector(".btn-delete")!;
        deleteBtn.addEventListener("click", () => {
            removeItem(item.id);
            renderItems();
        });

        const buyBtn = li.querySelector(".btn-buy")!;
        buyBtn.addEventListener("click", () => {
            const newBoughtStatus = !item.bought;
            editItem(item.id, item.name, newBoughtStatus);
            renderItems();
        });

        li.addEventListener("dblclick", () => {
            const newName = prompt("Enter new name:", item.name);
            if (newName !== null && newName.trim() !== "") {
                editItem(item.id, newName.trim(), item.bought);
                renderItems();
            }
        });

        shoppingList.appendChild(li);
    });
};

shoppingListForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const itemName = InputItem.value.trim();
    if (itemName) {
        addItems(itemName);
        InputItem.value = "";
        InputItem.focus();
        renderItems();
    }
});

renderItems();
