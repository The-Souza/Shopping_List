interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  bought?: boolean;
}

document.addEventListener("DOMContentLoaded", () => {
  const shoppingListForm = document.getElementById("shopping-list-form") as HTMLFormElement;
  const shoppingList = document.getElementById("shopping-list") as HTMLUListElement;
  const inputItem = document.getElementById("item") as HTMLInputElement;
  const inputQuantity = document.getElementById("quantity") as HTMLInputElement;
  const btnIncrease = document.getElementById("btn-increase") as HTMLButtonElement;
  const btnDecrease = document.getElementById("btn-decrease") as HTMLButtonElement;
  const btnClearList = document.getElementById("btn-clear-list") as HTMLButtonElement;
  const undoContainer = document.getElementById("undo-container");
  const btnUndo = document.getElementById("btn-undo") as HTMLButtonElement;

  const editItemNameInput = document.getElementById("editItemName") as HTMLInputElement;
  const editItemQtyInput = document.getElementById("editItemQty") as HTMLInputElement;
  const editIncreaseBtn = document.getElementById("edit-btn-increase") as HTMLButtonElement;
  const editDecreaseBtn = document.getElementById("edit-btn-decrease") as HTMLButtonElement;
  const saveEditBtn = document.getElementById("saveEditBtn") as HTMLButtonElement;
  const editModalElement = document.getElementById("editModal")!;
  const editModal = new (window as any).bootstrap.Modal(editModalElement);

  let currentEditId: string | null = null;
  let lastDeletedItem: ShoppingListItem | null = null;

  const loadItems = (): ShoppingListItem[] => {
    const items = localStorage.getItem("items");
    return items ? JSON.parse(items) : [];
  };

  const saveItems = (items: ShoppingListItem[]): void => {
    localStorage.setItem("items", JSON.stringify(items));
  };

  const isValidItemName = (name: string): boolean => /[a-zA-Z]/.test(name);

  const addItem = (name: string, quantity: number): void => {
    const items = loadItems();
    if (items.some(item => item.name.toLowerCase() === name.toLowerCase())) {
      alert("This item is already in the list.");
      return;
    }

    const newItem: ShoppingListItem = { id: new Date().toISOString(), name, quantity };
    items.push(newItem);
    saveItems(items);
  };

  const editItem = (id: string, newName: string, quantity?: number, bought?: boolean): void => {
    const items = loadItems();
    const itemIndex = items.findIndex(item => item.id === id);
    if (itemIndex === -1) return;

    items[itemIndex].name = newName;
    if (quantity !== undefined) items[itemIndex].quantity = quantity;
    if (bought !== undefined) items[itemIndex].bought = bought;
    saveItems(items);
  };

  const removeItem = (id: string): void => {
    const items = loadItems();
    const itemToDelete = items.find(item => item.id === id);
    if (!itemToDelete) return;

    lastDeletedItem = itemToDelete;
    const updatedItems = items.filter(item => item.id !== id);
    saveItems(updatedItems);
    renderItems();

    if (undoContainer) undoContainer.style.display = "block";
  };

  const undoDelete = (): void => {
    if (!lastDeletedItem) return;

    const items = loadItems();
    if (!items.some(item => item.id === lastDeletedItem!.id)) {
      items.push(lastDeletedItem);
      saveItems(items);
      renderItems();
    }

    if (undoContainer) undoContainer.style.display = "none";
    lastDeletedItem = null;
  };

  const renderItems = (): void => {
    const items = loadItems();
    shoppingList.innerHTML = "";

    items.forEach(item => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";

      li.innerHTML = `
        <span class="text-capitalize">${item.name} (Qty: ${item.quantity})</span>
        <div class="d-flex justify-content-end align-items-center gap-2">
          <button class="btn-buy btn btn-sm"><i class="bi bi-cash-coin fs-5"></i></button>
          <button class="btn-delete btn btn-outline-danger btn-sm"><i class="bi bi-trash fs-5"></i></button>
        </div>
      `;

      if (item.bought) li.classList.add("bought");

      const deleteBtn = li.querySelector(".btn-delete")!;
      deleteBtn.addEventListener("click", () => removeItem(item.id));

      const buyBtn = li.querySelector(".btn-buy")!;
      buyBtn.addEventListener("click", () => {
        editItem(item.id, item.name, item.quantity, !item.bought);
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

  btnIncrease.addEventListener("click", () => {
    let value = parseInt(inputQuantity.value, 10);
    inputQuantity.value = (value + 1).toString();
  });

  btnDecrease.addEventListener("click", () => {
    let value = parseInt(inputQuantity.value, 10);
    if (value > 1) inputQuantity.value = (value - 1).toString();
  });

  editIncreaseBtn.addEventListener("click", () => {
    let value = parseInt(editItemQtyInput.value, 10) || 0;
    editItemQtyInput.value = (value + 1).toString();
  });

  editDecreaseBtn.addEventListener("click", () => {
    let value = parseInt(editItemQtyInput.value, 10) || 0;
    if (value > 1) editItemQtyInput.value = (value - 1).toString();
  });

  saveEditBtn.addEventListener("click", () => {
    const newName = editItemNameInput.value.trim();
    const newQty = parseInt(editItemQtyInput.value.trim(), 10);

    if (!newName || isNaN(newQty) || newQty < 1 || !currentEditId) {
      alert("Please enter a valid name and quantity.");
      return;
    }

    editItem(currentEditId, newName, newQty);
    renderItems();
    editModal.hide();
  });

  btnUndo.addEventListener("click", undoDelete);

  btnClearList.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete the entire list?")) {
      localStorage.removeItem("items");
      renderItems();
    }
  });

  shoppingListForm.addEventListener("submit", event => {
    event.preventDefault();
    const name = inputItem.value.trim();
    const quantity = parseInt(inputQuantity.value.trim(), 10);

    if (!isValidItemName(name)) {
      alert("Item name must contain at least one letter.");
      return;
    }

    if (name && quantity > 0) {
      addItem(name, quantity);
      inputItem.value = "";
      inputQuantity.value = "0";
      inputItem.focus();
      renderItems();
    }
  });

  renderItems();
});
