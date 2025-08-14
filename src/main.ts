import { dom } from "./scripts/dom";
import {
    addItem,
    renderItems,
    updateItem,
    isValidItemName,
    undoDelete,
} from "./scripts/logic";
import { clearItems } from "./scripts/storage";
import "./styles/main.css";

let currentEditId: string | null = null;

dom.form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = dom.inputItem.value.trim();
    const qty = parseInt(dom.inputQuantity.value, 10);
    if (!isValidItemName(name))
        return alert("Item name must contain at least one letter.");
    if (name && qty > 0) {
        addItem(name, qty);
        dom.inputItem.value = "";
        dom.inputQuantity.value = "0";
        renderItems();
    }
});

dom.clearListBtn.addEventListener("click", () => {
    if (confirm("Delete entire list?")) {
        clearItems();
        renderItems();
    }
});

dom.undoBtn.addEventListener("click", undoDelete);

dom.saveEdit.addEventListener("click", () => {
    const name = dom.editName.value.trim();
    const qty = parseInt(dom.editQty.value, 10);
    if (!name || isNaN(qty) || qty < 1 || !currentEditId) return;
    updateItem(currentEditId, name, qty);
});

renderItems();
