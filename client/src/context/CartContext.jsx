import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "smart-store-cart";
const SESSION_LENGTH_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// A cart line is uniquely identified by product + color + size combo.
function lineKey(item) {
  return `${item.productId}__${item.color || ""}__${item.size || ""}`;
}

function loadStoredCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!parsed?.expiresAt || Date.now() > parsed.expiresAt) {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
    return Array.isArray(parsed.items) ? parsed.items : [];
  } catch {
    // Corrupted or inaccessible storage — fall back to an empty cart rather than crashing.
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadStoredCart);

  // Persist on every change. Each save resets the 7-day expiry, so an active
  // shopper's session keeps rolling forward instead of expiring mid-cart.
  useEffect(() => {
    try {
      if (items.length === 0) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ items, expiresAt: Date.now() + SESSION_LENGTH_MS })
        );
      }
    } catch {
      // Storage might be unavailable (private browsing, quota, etc.) — cart still
      // works in-memory for the current tab even if it can't persist.
    }
  }, [items]);

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
