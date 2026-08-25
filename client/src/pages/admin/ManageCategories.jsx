import { useEffect, useState } from "react";
import api from "../../api/axios";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

const emptyForm = { id: null, name: "", description: "", sortOrder: 0, imageFile: null, imagePreview: "" };

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/categories");
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  };

  const openEdit = (cat) => {
    setForm({
      id: cat._id,
      name: cat.name,
      description: cat.description || "",
      sortOrder: cat.sortOrder || 0,
      imageFile: null,
      imagePreview: cat.image?.url || "",
    });
    setError("");
    setShowForm(true);
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((f) => ({ ...f, imageFile: file, imagePreview: URL.createObjectURL(file) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Category name is required.");

    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("sortOrder", form.sortOrder);
      if (form.imageFile) fd.append("image", form.imageFile);

      if (form.id) {
        await api.put(`/categories/${form.id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await api.post("/categories", fd, { headers: { "Content-Type": "multipart/form-data" } });
      }
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't save category.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/categories/${deleteTarget._id}`);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't delete category.");
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Categories</h1>
        <button onClick={openNew} className="btn-primary bg-brand hover:bg-brand-dark">
          + New category
        </button>
      </div>

      {error && !showForm && <p className="mt-4 text-sm text-red-400">{error}</p>}

      {loading ? (
        <p className="mt-6 text-ink-faint">Loading…</p>
      ) : categories.length === 0 ? (
        <p className="mt-6 text-ink-faint">No categories yet. Create your first one.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div key={cat._id} className="rounded-xl2 border border-admin-border bg-admin-surface p-4">
              <div className="h-32 w-full overflow-hidden rounded-lg bg-admin-surface2">
                {cat.image?.url && <img src={cat.image.url} alt={cat.name} className="h-full w-full object-cover" />}
              </div>
              <p className="mt-3 font-medium">{cat.name}</p>
              {cat.description && <p className="mt-1 text-xs text-ink-faint line-clamp-2">{cat.description}</p>}
              <div className="mt-3 flex gap-3 text-sm">
                <button onClick={() => openEdit(cat)} className="text-brand hover:underline">Edit</button>
                <button onClick={() => setDeleteTarget(cat)} className="text-red-400 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5 py-8 overflow-y-auto">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-xl2 border border-admin-border bg-admin-surface p-6"
          >
            <h3 className="font-display text-lg font-semibold">{form.id ? "Edit category" : "New category"}</h3>

            <div className="mt-4">
              <label className="label-text text-ink-soft">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="admin-input"
                placeholder="e.g. Men's Shoes"
              />
            </div>

            <div className="mt-4">
              <label className="label-text text-ink-soft">Description (optional)</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
                className="admin-input resize-none"
              />
            </div>

            <div className="mt-4">
              <label className="label-text text-ink-soft">Sort order</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
                className="admin-input"
              />
            </div>

            <div className="mt-4">
              <label className="label-text text-ink-soft">Image</label>
              {form.imagePreview && (
                <img src={form.imagePreview} alt="" className="mb-2 h-24 w-24 rounded-lg object-cover" />
              )}
              <input type="file" accept="image/*" onChange={handleFile} className="text-sm text-ink-soft" />
            </div>

            {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary bg-transparent text-ink border-admin-border hover:border-ink-faint"
              >
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-primary bg-brand hover:bg-brand-dark">
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete category?"
        message={`This will permanently delete "${deleteTarget?.name}". Categories with existing products can't be deleted.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
