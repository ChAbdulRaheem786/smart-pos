import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

// A cart line is uniquely identified by product + color + size combo.
function lineKey(item) {
  return `${item.productId}__${item.color || ""}__${item.size || ""}`;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = (item) => {
    setItems((prev) => {
      const key = lineKey(item);
      const existing = prev.find((p) => lineKey(p) === key);
      if (existing) {
        return prev.map((p) =>
          lineKey(p) === key ? { ...p, quantity: p.quantity + item.quantity } : p
        );
      }
      return [...prev, item];
    });
  };

  const updateQuantity = (item, quantity) => {
    setItems((prev) =>
      prev.map((p) => (lineKey(p) === lineKey(item) ? { ...p, quantity: Math.max(1, quantity) } : p))
    );
  };

  const removeItem = (item) => {
    setItems((prev) => prev.filter((p) => lineKey(p) !== lineKey(item)));
  };

  const clearCart = () => setItems([]);

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const totalAmount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity * i.price, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clearCart, totalItems, totalAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
