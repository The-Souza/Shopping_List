interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  bought?: boolean;
}

const shoppingListForm = document.getElementById("shopping-list-form") as HTMLFormElement;
const shoppingList = document.getElementById("shopping-list") as HTMLUListElement;
const InputItem = document.getElementById("item") as HTMLInputElement;
const InputQuantity = document.getElementById("quantity") as HTMLInputElement;
const IncreaseBtn = document.getElementById("btn-increase") as HTMLButtonElement;
const DecreaseBtn = document.getElementById("btn-decrease") as HTMLButtonElement;

const editItemNameInput = document.getElementById("editItemName") as HTMLInputElement;
const editItemQtyInput = document.getElementById("editItemQty") as HTMLInputElement;
const editIncreaseBtn = document.getElementById("edit-btn-increase") as HTMLButtonElement;
const editDecreaseBtn = document.getElementById("edit-btn-decrease") as HTMLButtonElement;
const saveEditBtn = document.getElementById("saveEditBtn") as HTMLButtonElement;
const editModalElement = document.getElementById("editModal")!;
const editModal = new (window as any).bootstrap.Modal(editModalElement);

let currentEditId: string | null = null;

IncreaseBtn.addEventListener("click", () => {
  let value = parseInt(InputQuantity.value, 10);
  InputQuantity.value = (value + 1).toString();
});

DecreaseBtn.addEventListener("click", () => {
  let value = parseInt(InputQuantity.value, 10);
  if (value > 1) {
    InputQuantity.value = (value - 1).toString();
  }
});

editIncreaseBtn.addEventListener("click", () => {
  let value = parseInt(editItemQtyInput.value, 10) || 0;
  editItemQtyInput.value = (value + 1).toString();
});

editDecreaseBtn.addEventListener("click", () => {
  let value = parseInt(editItemQtyInput.value, 10) || 0;
  if (value > 1) {
    editItemQtyInput.value = (value - 1).toString();
  }
});

const isValidItemName = (name: string): boolean => {
  return /[a-zA-Z]/.test(name);
};

const loadItems = (): ShoppingListItem[] => {
  const items = localStorage.getItem("items");
  return items ? JSON.parse(items) : [];
};

const saveItems = (items: ShoppingListItem[]): void => {
  localStorage.setItem("items", JSON.stringify(items));
};

const addItems = (name: string, quantity: number) => {
  const items = loadItems();
  if (items.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
    alert("This item is already in the list.");
    return;
  }
  const newItem: ShoppingListItem = {
    id: new Date().toISOString(),
    name,
    quantity,
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
            <span class="text-capitalize">${item.name} (Qty: ${item.quantity})</span>
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
      currentEditId = item.id;
      editItemNameInput.value = item.name;
      editItemQtyInput.value = item.quantity.toString();
      editModal.show();
    });

    shoppingList.appendChild(li);
  });
};

saveEditBtn.addEventListener("click", () => {
  const newName = editItemNameInput.value.trim();
  const newQty = parseInt(editItemQtyInput.value.trim(), 10);

  if (!newName || isNaN(newQty) || newQty < 1 || !currentEditId) {
    alert("Please enter a valid name and quantity.");
    return;
  }

  const items = loadItems();
  const index = items.findIndex((item) => item.id === currentEditId);
  if (index !== -1) {
    items[index].name = newName;
    items[index].quantity = newQty;
    saveItems(items);
    renderItems();
    editModal.hide();
  }
});

shoppingListForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const itemName = InputItem.value.trim();
  const quantity = parseInt(InputQuantity.value.trim(), 10);

  if (!isValidItemName(itemName)) {
    alert("Item name must contain at least one letter.");
    return;
  }

  if (itemName && quantity > 0) {
    addItems(itemName, quantity);
    InputItem.value = "";
    InputQuantity.value = "0";
    InputItem.focus();
    renderItems();
  }
});

renderItems();
