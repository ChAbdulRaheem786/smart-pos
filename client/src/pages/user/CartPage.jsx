import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/format";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalAmount } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-ink-soft">Browse the shop and add something you like.</p>
        <Link to="/" className="btn-primary mt-6 inline-flex">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 pb-24">
      <h1 className="font-display text-2xl font-semibold">Your cart</h1>

      <div className="mt-6 divide-y divide-line rounded-xl2 border border-line bg-surface">
        {items.map((item, i) => (
          <div key={i} className="flex gap-4 p-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-surface2">
              {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-cover" />}
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <p className="font-medium text-ink">{item.name}</p>
                <p className="text-xs text-ink-soft">
                  {[item.color, item.size].filter(Boolean).join(" · ")}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center rounded-full border border-line">
                  <button
                    onClick={() => updateQuantity(item, item.quantity - 1)}
                    className="px-3 py-1 text-base leading-none hover:text-brand-dark"
                  >
                    −
                  </button>
                  <span className="w-7 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item, item.quantity + 1)}
                    className="px-3 py-1 text-base leading-none hover:text-brand-dark"
                  >
                    +
                  </button>
                </div>
                <span className="price-tag">{formatPrice(item.price * item.quantity)}</span>
              </div>
            </div>
            <button
              onClick={() => removeItem(item)}
              aria-label="Remove item"
              className="self-start text-ink-faint hover:text-red-400"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-xl2 border border-line bg-surface p-4">
        <span className="font-medium text-ink-soft">Total</span>
        <span className="price-tag text-base">{formatPrice(totalAmount)}</span>
      </div>

      <button onClick={() => navigate("/checkout")} className="btn-primary mt-6 w-full">
        Proceed to checkout
      </button>
    </div>
  );
}
