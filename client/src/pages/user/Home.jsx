import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import BannerSwiper from "../../components/user/BannerSwiper";
import ProductCard from "../../components/user/ProductCard";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [catsRes, featRes, prodRes, settingsRes] = await Promise.all([
          api.get("/categories"),
          api.get("/products", { params: { featured: true } }),
          api.get("/products"),
          api.get("/settings"),
        ]);
        setCategories(catsRes.data);
        setFeatured(featRes.data);
        setProducts(prodRes.data);
        setBanners(settingsRes.data.headerBanners || []);
      } catch (err) {
        setError("Couldn't load the store right now. Please refresh.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div className="mx-auto max-w-6xl px-5 py-24 text-center text-ink-soft">Loading store…</div>;
  }

  if (error) {
    return <div className="mx-auto max-w-6xl px-5 py-24 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-14 pb-20">
      {banners.length > 0 && (
        <div className="pt-6">
          <BannerSwiper banners={banners} />
        </div>
      )}

      {categories.length > 0 && (
        <section className="mx-auto max-w-6xl px-5">
          <h2 className="mb-5 font-display text-xl font-semibold">Shop by category</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/category/${cat.slug}`}
                className="group flex shrink-0 flex-col items-center gap-2 rounded-xl2 border border-line bg-white p-3 text-center shadow-card transition-shadow hover:shadow-cardHover w-28"
              >
                <div className="h-16 w-16 overflow-hidden rounded-lg bg-line/40">
                  {cat.image?.url && (
                    <img src={cat.image.url} alt={cat.name} className="h-full w-full object-cover" />
                  )}
                </div>
                <span className="text-xs font-medium leading-tight text-ink-soft group-hover:text-ink">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-5">
          <h2 className="mb-5 font-display text-xl font-semibold">Featured</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-5">
        <h2 className="mb-5 font-display text-xl font-semibold">All products</h2>
        {products.length === 0 ? (
          <p className="text-ink-soft">No products yet — check back soon.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
