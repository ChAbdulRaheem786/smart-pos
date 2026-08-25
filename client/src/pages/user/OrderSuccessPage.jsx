import { Link, useLocation } from "react-router-dom";

export default function OrderSuccessPage() {
  const { state } = useLocation();
  const orderId = state?.orderId;

  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-light text-brand-dark">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <h1 className="mt-6 font-display text-2xl font-semibold">Order placed</h1>
      <p className="mt-2 text-ink-soft">
        Thanks — we've received your order and payment proof. We'll reach out to confirm details shortly.
      </p>
      {orderId && (
        <p className="mt-3 font-mono text-xs text-ink-soft/60">Reference: {orderId}</p>
      )}
      <Link to="/" className="btn-primary mt-8 inline-flex">
        Continue shopping
      </Link>
    </div>
  );
}
