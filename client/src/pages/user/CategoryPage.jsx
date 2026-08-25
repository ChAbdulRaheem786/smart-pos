import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import ProductCard from "../../components/user/ProductCard";

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    (async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get(`/categories/${slug}`),
          api.get("/products", { params: { category: slug } }),
        ]);
        setCategory(catRes.data);
        setProducts(prodRes.data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) return <div className="mx-auto max-w-6xl px-5 py-24 text-center text-ink-soft">Loading…</div>;

  if (notFound) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-24 text-center">
        <p className="text-ink-soft">We couldn't find that category.</p>
        <Link to="/" className="mt-4 inline-block text-brand-dark underline">
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 pb-20">
      <Link to="/" className="text-sm text-ink-soft hover:text-ink">
        &larr; All categories
      </Link>
      <h1 className="mt-3 font-display text-2xl font-semibold">{category.name}</h1>
      {category.description && <p className="mt-1 text-ink-soft">{category.description}</p>}

      <div className="mt-8">
        {products.length === 0 ? (
          <p className="text-ink-soft">No products in this category yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
