// Импортируем необходимые хуки и типы из React
import { createContext, useContext, useState, useMemo } from "react";
import type { ReactNode } from "react";
import type { CartItem, MenuItem } from "../types";

// Интерфейс значений контекста корзины
interface CartContextValue {
    items: CartItem[];                              // Массив позиций в корзине
    totalAmount: number;                            // Общая сумма заказа
    totalCount: number;                             // Общее количество товаров
    addItem: (item: MenuItem) => void;              // Добавить товар в корзину
    updateQuantity: (id: number, newQty: number) => void;  // Изменить количество
    removeItem: (id: number) => void;               // Удалить товар из корзины
    clearCart: () => void;                          // Очистить всю корзину
}

// Создаём контекст с начальным значением null
const CartContext = createContext<CartContextValue | null>(null);

// Провайдер корзины — оборачивает приложение и даёт доступ к состоянию корзины
export function CartProvider({ children }: { children: ReactNode }) {
    // Состояние: список товаров в корзине
    const [items, setItems] = useState<CartItem[]>([]);

    // Значения вычисляются только при изменении items
    const totalAmount = useMemo(
        () => items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0),
        [items]
    );

    const totalCount = useMemo(
        () => items.reduce((sum, item) => sum + item.quantity, 0),
        [items]
    );

    // 1. Добавить товар в корзину
    const addItem = (menuItem: MenuItem) => {
        setItems((prev) => {
            // Проверяем, есть ли уже такой товар в корзине
            const existing = prev.find((item) => item.menuItem.id === menuItem.id);
            if (existing) {
                // Если товар уже есть — увеличиваем количество на 1
                return prev.map((item) =>
                    item.menuItem.id === menuItem.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            // Если товара нет — добавляем новый с количеством 1
            return [...prev, { menuItem, quantity: 1 }];
        });
    };

    // 2. Обновить количество товара (если newQty <= 0 — удаляем товар)
    const updateQuantity = (id: number, newQty: number) => {
        setItems((prev) => {
            return prev
                .map((item) =>
                    item.menuItem.id === id ? { ...item, quantity: newQty } : item
                )
                .filter((item) => item.quantity > 0);  // Удаляем товары с количеством 0
        });
    };

    // 3. Удалить товар из корзины
    const removeItem = (id: number) => {
        setItems((prev) => prev.filter((item) => item.menuItem.id !== id));
    };

    // 4. Очистить всю корзину
    const clearCart = () => {
        setItems([]);
    };

    // Значения, которые будут доступны через useContext
    return (
        <CartContext.Provider
         value={{ items, totalAmount, totalCount, addItem, updateQuantity, removeItem, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
}
export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}