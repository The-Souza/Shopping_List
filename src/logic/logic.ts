import type { ShoppingListItem } from "../types";
import { loadItems, saveItems } from "./storage";

let lastDeletedItem: ShoppingListItem | null = null;

export const addItem = (name: string, quantity: number): void => {
    const items = loadItems();

    if (items.some((i) => i.name.toLowerCase() === name.toLowerCase())) {
        alert("This item is already in the list.");
        return;
    }

    const newItem: ShoppingListItem = {
        id: new Date().toISOString(),
        name,
        quantity,
        bought: false,
    };

    items.push(newItem);
    saveItems(items);
};

export const removeItem = (id: string): void => {
    const items = loadItems();
    const itemToDelete = items.find((i) => i.id === id);
    if (!itemToDelete) return;

    lastDeletedItem = itemToDelete;
    const updated = items.filter((i) => i.id !== id);
    saveItems(updated);
};

export const undoDelete = (): void => {
    if (!lastDeletedItem) return;
    const items = loadItems();

    if (!items.some((i) => i.id === lastDeletedItem!.id)) {
        items.push(lastDeletedItem);
        saveItems(items);
    }

    lastDeletedItem = null;
};

export const editItem = (
    id: string,
    newName: string,
    newQty: number,
    bought?: boolean
): void => {
    const items = loadItems();
    const index = items.findIndex((i) => i.id === id);

    if (index !== -1) {
        items[index].name = newName;
        items[index].quantity = newQty;
        if (typeof bought !== "undefined") {
            items[index].bought = bought;
        }
        saveItems(items);
    }
};
