import type { ShoppingListItem } from "../types";

export const loadItems = (): ShoppingListItem[] => {
    const items = localStorage.getItem("items");
    return items ? JSON.parse(items) : [];
};

export const saveItems = (items: ShoppingListItem[]): void => {
    localStorage.setItem("items", JSON.stringify(items));
};

export const clearItems = (): void => {
    localStorage.removeItem("items");
};
