import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/format";
import api from "../../api/axios";

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    notes: "",
  });
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold">Nothing to check out</h1>
        <p className="mt-2 text-ink-soft">Your cart is empty.</p>
        <Link to="/" className="btn-primary mt-6 inline-flex">
          Back to shop
        </Link>
      </div>
    );
  }

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProofFile(file);
    setProofPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.fullName || !form.phone || !form.address || !form.city) {
      setError("Please fill in your name, phone, address, and city.");
      return;
    }
    if (!proofFile) {
      setError("Please upload a screenshot or photo of your payment proof.");
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append(
        "items",
        JSON.stringify(
          items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            color: i.color,
            size: i.size,
          }))
        )
      );
      fd.append("paymentProof", proofFile);

      const { data } = await api.post("/orders", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      clearCart();
      navigate("/order-success", { state: { orderId: data.orderId } });
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't place your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 pb-24">
      <h1 className="font-display text-2xl font-semibold">Checkout</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Fill in your details and attach your payment proof to complete the order.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {/* Order summary */}
        <div className="rounded-xl2 border border-line bg-surface p-4">
          <p className="mb-3 text-sm font-semibold text-ink-soft">Order summary</p>
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>
                  {item.name}
                  {item.color || item.size ? ` (${[item.color, item.size].filter(Boolean).join(", ")})` : ""}
                  {" × "}
                  {item.quantity}
                </span>
                <span className="font-mono">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between border-t border-line pt-3 text-sm font-semibold">
            <span>Total</span>
            <span className="font-mono">{formatPrice(totalAmount)}</span>
          </div>
        </div>

        {/* Customer details */}
        <div className="space-y-4">
          <p className="text-sm font-semibold text-ink-soft">Your details</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-text" htmlFor="fullName">Full name</label>
              <input
                id="fullName"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="input-field"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="label-text" htmlFor="phone">Phone number</label>
              <input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="03xxxxxxxxx"
              />
            </div>
          </div>
          <div>
            <label className="label-text" htmlFor="email">Email (optional)</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="input-field"
              placeholder="jane@example.com"
            />
          </div>
          <div>
            <label className="label-text" htmlFor="address">Delivery address</label>
            <input
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="input-field"
              placeholder="House / street / area"
            />
          </div>
          <div>
            <label className="label-text" htmlFor="city">City</label>
            <input
              id="city"
              name="city"
              value={form.city}
              onChange={handleChange}
              className="input-field"
              placeholder="Lahore"
            />
          </div>
          <div>
            <label className="label-text" htmlFor="notes">Order notes (optional)</label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="input-field resize-none"
              placeholder="Anything we should know about your order?"
            />
          </div>
        </div>

        {/* Payment proof */}
        <div>
          <p className="text-sm font-semibold text-ink-soft">Payment proof</p>
          <p className="mt-1 text-xs text-ink-faint">
            Upload a screenshot or photo of your bank transfer / payment receipt.
          </p>
          <label
            htmlFor="paymentProof"
            className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-xl2 border-2 border-dashed border-line bg-surface p-6 text-center hover:border-brand"
          >
            {proofPreview ? (
              <img src={proofPreview} alt="Payment proof preview" className="max-h-52 rounded-lg object-contain" />
            ) : (
              <>
                <span className="text-sm font-medium text-ink">Tap to upload an image</span>
                <span className="mt-1 text-xs text-ink-faint">JPG, PNG, or WEBP — up to 8MB</span>
              </>
            )}
          </label>
          <input
            id="paymentProof"
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
        </div>

        {error && <p className="text-sm font-medium text-red-400">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Placing order…" : "Place order"}
        </button>
      </form>
    </div>
  );
}
