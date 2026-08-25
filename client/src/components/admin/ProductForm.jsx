import { useEffect, useState } from "react";

const emptyForm = {
  id: null,
  name: "",
  description: "",
  price: "",
  discountPrice: "",
  category: "",
  colors: "",
  sizes: "",
  stock: "",
  sku: "",
  featured: false,
  active: true,
};

export default function ProductForm({ product, categories, onSubmit, onCancel, saving, error }) {
  const [form, setForm] = useState(emptyForm);
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedPublicIds, setRemovedPublicIds] = useState([]);

  useEffect(() => {
    if (product) {
      setForm({
        id: product._id,
        name: product.name,
        description: product.description || "",
        price: product.price,
        discountPrice: product.discountPrice ?? "",
        category: product.category?._id || product.category || "",
        colors: (product.colors || []).join(", "),
        sizes: (product.sizes || []).join(", "),
        stock: product.stock ?? "",
        sku: product.sku || "",
        featured: !!product.featured,
        active: product.active !== false,
      });
      setExistingImages(product.images || []);
    } else {
      setForm(emptyForm);
      setExistingImages([]);
    }
    setNewImages([]);
    setNewPreviews([]);
    setRemovedPublicIds([]);
  }, [product]);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    setNewImages((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeExisting = (publicId) => {
    setExistingImages((prev) => prev.filter((img) => img.publicId !== publicId));
    setRemovedPublicIds((prev) => [...prev, publicId]);
  };

  const removeNew = (idx) => {
    setNewImages((prev) => prev.filter((_, i) => i !== idx));
    setNewPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ form, newImages, removedPublicIds });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-5 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl rounded-xl2 border border-admin-border bg-admin-surface p-6"
      >
        <h3 className="font-display text-lg font-semibold">{form.id ? "Edit product" : "New product"}</h3>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label-text text-ink-soft">Product name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="admin-input"
              placeholder="e.g. Classic Leather Sneaker"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="label-text text-ink-soft">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className="admin-input resize-none"
            />
          </div>

          <div>
            <label className="label-text text-ink-soft">Price</label>
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              className="admin-input"
            />
          </div>
          <div>
            <label className="label-text text-ink-soft">Discount price (optional)</label>
            <input
              type="number"
              min="0"
              value={form.discountPrice}
              onChange={(e) => setForm((f) => ({ ...f, discountPrice: e.target.value }))}
              className="admin-input"
            />
          </div>

          <div>
            <label className="label-text text-ink-soft">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="admin-input"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-text text-ink-soft">Stock</label>
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
              className="admin-input"
            />
          </div>

          <div>
            <label className="label-text text-ink-soft">Colors (comma separated)</label>
            <input
              value={form.colors}
              onChange={(e) => setForm((f) => ({ ...f, colors: e.target.value }))}
              className="admin-input"
              placeholder="Red, Black, White"
            />
          </div>
          <div>
            <label className="label-text text-ink-soft">Sizes (comma separated)</label>
            <input
              value={form.sizes}
              onChange={(e) => setForm((f) => ({ ...f, sizes: e.target.value }))}
              className="admin-input"
              placeholder="S, M, L, XL"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="label-text text-ink-soft">SKU (optional)</label>
            <input
              value={form.sku}
              onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
              className="admin-input"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
            />
            Show in featured swiper
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
            />
            Active (visible in store)
          </label>
        </div>

        <div className="mt-5">
          <label className="label-text text-ink-soft">Product photos</label>
          <div className="flex flex-wrap gap-3">
            {existingImages.map((img) => (
              <div key={img.publicId} className="relative h-20 w-20">
                <img src={img.url} alt="" className="h-full w-full rounded-lg object-cover" />
                <button
                  type="button"
                  onClick={() => removeExisting(img.publicId)}
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white"
                >
                  ✕
                </button>
              </div>
            ))}
            {newPreviews.map((src, i) => (
              <div key={i} className="relative h-20 w-20">
                <img src={src} alt="" className="h-full w-full rounded-lg object-cover" />
                <button
                  type="button"
                  onClick={() => removeNew(i)}
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white"
                >
                  ✕
                </button>
              </div>
            ))}
            <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-admin-border text-ink-faint hover:border-brand">
              +
              <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
            </label>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary bg-transparent text-ink border-admin-border hover:border-ink-faint"
          >
            Cancel
          </button>
          <button type="submit" disabled={saving} className="btn-primary bg-brand hover:bg-brand-dark">
            {saving ? "Saving…" : "Save product"}
          </button>
        </div>
      </form>
    </div>
  );
}
