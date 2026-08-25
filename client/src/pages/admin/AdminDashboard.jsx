import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { formatPrice } from "../../utils/format";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async () => {
      const [catRes, prodRes, orderRes] = await Promise.all([
        api.get("/categories"),
        api.get("/products/admin/all"),
        api.get("/orders"),
      ]);
      const pending = orderRes.data.filter((o) => o.status === "pending");
      const revenue = orderRes.data
        .filter((o) => o.status !== "cancelled")
        .reduce((sum, o) => sum + o.totalAmount, 0);

      setStats({
        categories: catRes.data.length,
        products: prodRes.data.length,
        orders: orderRes.data.length,
        pending: pending.length,
        revenue,
        recentOrders: orderRes.data.slice(0, 5),
      });
    })();
  }, []);

  if (!stats) return <p className="text-ink-faint">Loading…</p>;

  const cards = [
    { label: "Categories", value: stats.categories, to: "/admin/categories" },
    { label: "Products", value: stats.products, to: "/admin/products" },
    { label: "Total orders", value: stats.orders, to: "/admin/orders" },
    { label: "Pending orders", value: stats.pending, to: "/admin/orders" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Overview</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="rounded-xl2 border border-admin-border bg-admin-surface p-5 hover:border-brand transition-colors"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">{c.label}</p>
            <p className="mt-2 font-display text-3xl font-semibold">{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 rounded-xl2 border border-admin-border bg-admin-surface p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">
          Revenue (confirmed + shipped + completed)
        </p>
        <p className="mt-2 font-display text-3xl font-semibold">{formatPrice(stats.revenue)}</p>
      </div>

      <div className="mt-6 rounded-xl2 border border-admin-border bg-admin-surface p-5">
        <div className="flex items-center justify-between">
          <p className="font-display text-lg font-semibold">Recent orders</p>
          <Link to="/admin/orders" className="text-sm text-brand hover:underline">View all</Link>
        </div>
        <div className="mt-4 divide-y divide-admin-border">
          {stats.recentOrders.length === 0 && <p className="py-4 text-sm text-ink-faint">No orders yet.</p>}
          {stats.recentOrders.map((o) => (
            <div key={o._id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <p className="font-medium">{o.customer.fullName}</p>
                <p className="text-xs text-ink-faint">{new Date(o.createdAt).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="font-mono">{formatPrice(o.totalAmount)}</p>
                <span className="text-xs capitalize text-ink-faint">{o.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
