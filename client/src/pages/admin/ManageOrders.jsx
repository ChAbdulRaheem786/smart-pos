import { useEffect, useState } from "react";
import api from "../../api/axios";
import { formatPrice } from "../../utils/format";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

const STATUSES = ["pending", "confirmed", "shipped", "completed", "cancelled"];

const statusColors = {
  pending: "bg-amber/20 text-amber",
  confirmed: "bg-brand-light text-brand-dark",
  shipped: "bg-blue-500/20 text-blue-300",
  completed: "bg-brand/20 text-brand",
  cancelled: "bg-red-500/20 text-red-400",
};

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [activeOrder, setActiveOrder] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/orders", { params: statusFilter ? { status: statusFilter } : {} });
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const updateStatus = async (order, status) => {
    await api.patch(`/orders/${order._id}/status`, { status });
    setOrders((prev) => prev.map((o) => (o._id === order._id ? { ...o, status } : o)));
    if (activeOrder?._id === order._id) setActiveOrder((o) => ({ ...o, status }));
  };

  const handleDelete = async () => {
    await api.delete(`/orders/${deleteTarget._id}`);
    setDeleteTarget(null);
    setActiveOrder(null);
    await load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold">Orders</h1>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="admin-input w-44">
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="mt-6 text-ink-faint">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="mt-6 text-ink-faint">No orders found.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl2 border border-admin-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-admin-border bg-admin-surface text-left text-ink-faint">
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-b border-admin-border bg-admin-surface/40 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium">{o.customer.fullName}</p>
                    <p className="text-xs text-ink-faint">{o.customer.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{o.items.length} item(s)</td>
                  <td className="px-4 py-3 font-mono">{formatPrice(o.totalAmount)}</td>
                  <td className="px-4 py-3 text-ink-faint">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusColors[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setActiveOrder(o)} className="text-brand hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeOrder && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-5 py-8">
          <div className="w-full max-w-lg rounded-xl2 border border-admin-border bg-admin-surface p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold">{activeOrder.customer.fullName}</h3>
                <p className="text-sm text-ink-faint">{new Date(activeOrder.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setActiveOrder(null)} className="text-ink-faint hover:text-ink">✕</button>
            </div>

            <div className="mt-4 space-y-1 text-sm text-ink-soft">
              <p><span className="text-ink-faint">Phone:</span> {activeOrder.customer.phone}</p>
              {activeOrder.customer.email && <p><span className="text-ink-faint">Email:</span> {activeOrder.customer.email}</p>}
              <p><span className="text-ink-faint">Address:</span> {activeOrder.customer.address}, {activeOrder.customer.city}</p>
              {activeOrder.customer.notes && <p><span className="text-ink-faint">Notes:</span> {activeOrder.customer.notes}</p>}
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Items</p>
              <div className="mt-2 space-y-2">
                {activeOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span>
                      {item.name}
                      {item.color || item.size ? ` (${[item.color, item.size].filter(Boolean).join(", ")})` : ""}
                      {" × "}{item.quantity}
                    </span>
                    <span className="font-mono">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between border-t border-admin-border pt-2 text-sm font-semibold">
                <span>Total</span>
                <span className="font-mono">{formatPrice(activeOrder.totalAmount)}</span>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Payment proof</p>
              <a href={activeOrder.paymentProof.url} target="_blank" rel="noopener noreferrer">
                <img
                  src={activeOrder.paymentProof.url}
                  alt="Payment proof"
                  className="mt-2 max-h-64 rounded-lg border border-admin-border object-contain"
                />
              </a>
            </div>

            <div className="mt-5">
              <p className="label-text text-ink-soft">Update status</p>
              <select
                value={activeOrder.status}
                onChange={(e) => updateStatus(activeOrder, e.target.value)}
                className="admin-input"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="capitalize">{s}</option>
                ))}
              </select>
            </div>

            <div className="mt-6 flex justify-between">
              <button onClick={() => setDeleteTarget(activeOrder)} className="text-sm text-red-400 hover:underline">
                Delete order
              </button>
              <button
                onClick={() => setActiveOrder(null)}
                className="btn-secondary bg-transparent text-ink border-admin-border hover:border-ink-faint"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete order?"
        message="This will permanently remove this order and its payment proof."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
