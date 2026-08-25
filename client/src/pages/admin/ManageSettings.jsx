import { useEffect, useState } from "react";
import api from "../../api/axios";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

export default function ManageSettings() {
  const [settings, setSettings] = useState(null);
  const [siteName, setSiteName] = useState("");
  const [savingName, setSavingName] = useState(false);

  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerLink, setBannerLink] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    const { data } = await api.get("/settings");
    setSettings(data);
    setSiteName(data.siteName || "");
  };

  useEffect(() => {
    load();
  }, []);

  const saveSiteName = async () => {
    setSavingName(true);
    try {
      await api.put("/settings", { siteName });
      await load();
    } finally {
      setSavingName(false);
    }
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const uploadBanner = async (e) => {
    e.preventDefault();
    if (!bannerFile) return setError("Choose an image first.");
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("image", bannerFile);
      fd.append("title", bannerTitle);
      fd.append("link", bannerLink);
      await api.post("/settings/banners", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setBannerFile(null);
      setBannerPreview("");
      setBannerTitle("");
      setBannerLink("");
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't upload banner.");
    } finally {
      setUploading(false);
    }
  };

  const deleteBanner = async () => {
    await api.delete(`/settings/banners/${deleteTarget._id}`);
    setDeleteTarget(null);
    await load();
  };

  if (!settings) return <p className="text-paper/50">Loading…</p>;

  return (
    <div className="max-w-2xl space-y-10">
      <div>
        <h1 className="font-display text-2xl font-semibold">Settings</h1>
      </div>

      <div className="rounded-xl2 border border-admin-border bg-admin-surface p-5">
        <p className="font-display text-lg font-semibold">Store name</p>
        <p className="mt-1 text-sm text-paper/50">Shown in the storefront navbar and footer.</p>
        <div className="mt-4 flex gap-3">
          <input value={siteName} onChange={(e) => setSiteName(e.target.value)} className="admin-input" />
          <button onClick={saveSiteName} disabled={savingName} className="btn-primary shrink-0 bg-brand hover:bg-brand-dark">
            {savingName ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <div className="rounded-xl2 border border-admin-border bg-admin-surface p-5">
        <p className="font-display text-lg font-semibold">Header banners</p>
        <p className="mt-1 text-sm text-paper/50">
          These rotate at the top of the storefront homepage. Recommended size ~1600×700px.
        </p>

        {settings.headerBanners.length > 0 && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {settings.headerBanners.map((b) => (
              <div key={b._id} className="relative overflow-hidden rounded-lg border border-admin-border">
                <img src={b.url} alt={b.title || ""} className="h-28 w-full object-cover" />
                {b.title && (
                  <p className="absolute bottom-0 left-0 right-0 truncate bg-black/50 px-2 py-1 text-xs text-paper">
                    {b.title}
                  </p>
                )}
                <button
                  onClick={() => setDeleteTarget(b)}
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={uploadBanner} className="mt-5 space-y-3 border-t border-admin-border pt-5">
          <label
            htmlFor="bannerFile"
            className="flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-admin-border text-sm text-paper/50 hover:border-brand"
          >
            {bannerPreview ? (
              <img src={bannerPreview} alt="" className="h-full rounded-lg object-contain" />
            ) : (
              "Click to choose an image"
            )}
          </label>
          <input id="bannerFile" type="file" accept="image/*" onChange={handleFile} className="hidden" />

          <input
            value={bannerTitle}
            onChange={(e) => setBannerTitle(e.target.value)}
            placeholder="Banner title (optional)"
            className="admin-input"
          />
          <input
            value={bannerLink}
            onChange={(e) => setBannerLink(e.target.value)}
            placeholder="Link when clicked, e.g. /category/shoes (optional)"
            className="admin-input"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={uploading} className="btn-primary bg-brand hover:bg-brand-dark">
            {uploading ? "Uploading…" : "Add banner"}
          </button>
        </form>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete banner?"
        message="This banner will be removed from the homepage swiper."
        onConfirm={deleteBanner}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
