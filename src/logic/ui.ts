import { addItem, removeItem, undoDelete, editItem } from "./logic";
import { loadItems, clearItems } from "./storage";

const shoppingListForm = document.getElementById("shopping-list-form") as HTMLFormElement | null;
const shoppingList = document.getElementById("shopping-list") as HTMLUListElement | null;
const InputItem = document.getElementById("item") as HTMLInputElement | null;
const InputQuantity = document.getElementById("quantity") as HTMLInputElement | null;
const IncreaseBtn = document.getElementById("btn-increase") as HTMLButtonElement | null;
const DecreaseBtn = document.getElementById("btn-decrease") as HTMLButtonElement | null;

const editItemNameInput = document.getElementById("editItemName") as HTMLInputElement | null;
const editItemQtyInput = document.getElementById("editItemQty") as HTMLInputElement | null;
const editIncreaseBtn = document.getElementById("edit-btn-increase") as HTMLButtonElement | null;
const editDecreaseBtn = document.getElementById("edit-btn-decrease") as HTMLButtonElement | null;
const saveEditBtn = document.getElementById("saveEditBtn") as HTMLButtonElement | null;
const editModalElement = document.getElementById("editModal");

const clearListBtn = document.getElementById("btn-clear-list") as HTMLButtonElement | null;
const undoBtn = document.getElementById("btn-undo") as HTMLButtonElement | null;
const undoContainer = document.getElementById("undo-container") as HTMLDivElement | null;

let currentEditId: string | null = null;

const editModal = editModalElement ? new (window as any).bootstrap.Modal(editModalElement) : null;

export const renderItems = (): void => {
    if (!shoppingList) return;

    const items = loadItems();
    shoppingList.innerHTML = "";

    items.forEach(item => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        if (item.bought) li.classList.add("bought");

        li.innerHTML = `
            <span class="text-capitalize">${item.name} (Qty: ${item.quantity})</span>
            <div class="d-flex justify-content-end align-items-center gap-2">
                <button class="btn-buy btn btn-sm"><i class="bi bi-cash-coin fs-5"></i></button>
                <button class="btn-delete btn btn-sm"><i class="bi bi-trash fs-5"></i></button>
            </div>
        `;

        li.querySelector(".btn-delete")?.addEventListener("click", () => {
            removeItem(item.id);
            renderItems();
            if (undoContainer) undoContainer.style.display = "block";
        });

        li.querySelector(".btn-buy")?.addEventListener("click", () => {
            editItem(item.id, item.name, item.quantity, !item.bought);
            renderItems();
        });

        li.addEventListener("dblclick", () => {
            currentEditId = item.id;
            if (editItemNameInput && editItemQtyInput) {
                editItemNameInput.value = item.name;
                editItemQtyInput.value = item.quantity.toString();
            }
            if (editModal) editModal.show();
        });

        shoppingList.appendChild(li);
    });
};

IncreaseBtn?.addEventListener("click", () => {
    if (InputQuantity) InputQuantity.value = (parseInt(InputQuantity.value, 10) + 1).toString();
});

DecreaseBtn?.addEventListener("click", () => {
    if (InputQuantity) {
        const value = parseInt(InputQuantity.value, 10);
        if (value > 1) InputQuantity.value = (value - 1).toString();
    }
});

editIncreaseBtn?.addEventListener("click", () => {
    if (editItemQtyInput) editItemQtyInput.value = (parseInt(editItemQtyInput.value, 10) + 1).toString();
});

editDecreaseBtn?.addEventListener("click", () => {
    if (editItemQtyInput) {
        const value = parseInt(editItemQtyInput.value, 10);
        if (value > 1) editItemQtyInput.value = (value - 1).toString();
    }
});

clearListBtn?.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete the entire list?")) {
        clearItems();
        renderItems();
    }
});

undoBtn?.addEventListener("click", () => {
    undoDelete();
    renderItems();
    if (undoContainer) undoContainer.style.display = "none";
});

saveEditBtn?.addEventListener("click", () => {
    if (!currentEditId || !editItemNameInput || !editItemQtyInput) return;

    const newName = editItemNameInput.value.trim();
    const newQty = parseInt(editItemQtyInput.value.trim(), 10);

    if (!newName || isNaN(newQty) || newQty < 1) {
        alert("Please enter a valid name and quantity.");
        return;
    }

    editItem(currentEditId, newName, newQty);
    renderItems();
    if (editModal) editModal.hide();
});

shoppingListForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!InputItem || !InputQuantity) return;

    const name = InputItem.value.trim();
    const qty = parseInt(InputQuantity.value.trim(), 10);

    if (!/[a-zA-Z]/.test(name)) {
        alert("Item name must contain at least one letter.");
        return;
    }

    if (name && qty > 0) {
        addItem(name, qty);
        InputItem.value = "";
        InputQuantity.value = "0";
        InputItem.focus();
        renderItems();
    }
});
