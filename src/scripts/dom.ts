export const dom = {
    form: document.getElementById("shopping-list-form") as HTMLFormElement,
    list: document.getElementById("shopping-list") as HTMLUListElement,
    inputItem: document.getElementById("item") as HTMLInputElement,
    inputQuantity: document.getElementById("quantity") as HTMLInputElement,
    btnIncrease: document.getElementById("btn-increase") as HTMLButtonElement,
    btnDecrease: document.getElementById("btn-decrease") as HTMLButtonElement,

    editName: document.getElementById("editItemName") as HTMLInputElement,
    editQty: document.getElementById("editItemQty") as HTMLInputElement,
    editIncrease: document.getElementById("edit-btn-increase") as HTMLButtonElement,
    editDecrease: document.getElementById("edit-btn-decrease") as HTMLButtonElement,
    saveEdit: document.getElementById("saveEditBtn") as HTMLButtonElement,
    editModalElement: document.getElementById("editModal")!,

    clearListBtn: document.getElementById("btn-clear-list") as HTMLButtonElement,
    undoContainer: document.getElementById("undo-container")!,
    undoBtn: document.getElementById("btn-undo") as HTMLButtonElement,
};
