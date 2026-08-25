// Set VITE_CURRENCY in the frontend's env vars to change this (e.g. "USD", "AED", "GBP").
// Defaults to PKR — override it if your store isn't billing in Pakistani Rupees.
const CURRENCY = import.meta.env.VITE_CURRENCY || "PKR";

export function formatPrice(amount) {
  if (amount === null || amount === undefined) return "";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: CURRENCY,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${CURRENCY} ${Number(amount).toFixed(0)}`;
  }
}
