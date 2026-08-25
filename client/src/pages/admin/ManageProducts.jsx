import { useEffect, useState } from "react";
import api from "../../api/axios";
import ProductForm from "../../components/admin/ProductForm";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import { formatPrice } from "../../utils/format";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("");

  const load = async () => {
    setLoading(true);
    const [prodRes, catRes] = await Promise.all([api.get("/products/admin/all"), api.get("/categories")]);
    setProducts(prodRes.data);
    setCategories(catRes.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditingProduct(null);
    setError("");
    setShowForm(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async ({ form, newImages, removedPublicIds }) => {
    if (!form.name.trim() || !form.price || !form.category) {
      setError("Name, price, and category are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("price", form.price);
      fd.append("discountPrice", form.discountPrice);
      fd.append("category", form.category);
      fd.append("colors", form.colors);
      fd.append("sizes", form.sizes);
      fd.append("stock", form.stock || 0);
      fd.append("sku", form.sku);
      fd.append("featured", form.featured);
      fd.append("active", form.active);
      newImages.forEach((file) => fd.append("images", file));
      if (removedPublicIds.length) fd.append("removeImagePublicIds", JSON.stringify(removedPublicIds));

      if (form.id) {
        await api.put(`/products/${form.id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await api.post("/products", fd, { headers: { "Content-Type": "multipart/form-data" } });
      }
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    await api.delete(`/products/${deleteTarget._id}`);
    setDeleteTarget(null);
    await load();
  };

  const visibleProducts = categoryFilter
    ? products.filter((p) => (p.category?._id || p.category) === categoryFilter)
    : products;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold">Products</h1>
        <div className="flex items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="admin-input w-44"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          <button onClick={openNew} className="btn-primary bg-brand hover:bg-brand-dark">
            + New product
          </button>
        </div>
      </div>

      {loading ? (
        <p className="mt-6 text-ink-faint">Loading…</p>
      ) : visibleProducts.length === 0 ? (
        <p className="mt-6 text-ink-faint">No products found. Add your first one.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl2 border border-admin-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-admin-border bg-admin-surface text-left text-ink-faint">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {visibleProducts.map((p) => (
                <tr key={p._id} className="border-b border-admin-border bg-admin-surface/40 last:border-0">
                  <td className="flex items-center gap-3 px-4 py-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-admin-surface2">
                      {p.images?.[0]?.url && <img src={p.images[0].url} alt="" className="h-full w-full object-cover" />}
                    </div>
                    <span className="font-medium">{p.name}</span>
                    {p.featured && (
                      <span className="rounded-full bg-amber/20 px-2 py-0.5 text-[10px] font-semibold text-amber">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{p.category?.name || "—"}</td>
                  <td className="px-4 py-3 font-mono">{formatPrice(p.discountPrice || p.price)}</td>
                  <td className="px-4 py-3 text-ink-soft">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${p.active ? "text-brand" : "text-ink-faint"}`}>
                      {p.active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(p)} className="text-brand hover:underline">Edit</button>
                    <button
                      onClick={() => setDeleteTarget(p)}
                      className="ml-3 text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          saving={saving}
          error={error}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete product?"
        message={`This will permanently delete "${deleteTarget?.name}" and its photos.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
