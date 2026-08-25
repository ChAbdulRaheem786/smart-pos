import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import ProductCard from "./ProductCard";
import { useSettings } from "../../context/SettingsContext";
import { formatPrice } from "../../utils/format";

export default function ProductsSection() {
  const { categories } = useSettings();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMeta, setFilterMeta] = useState({ colors: [], sizes: [], minPrice: 0, maxPrice: 0 });
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeCategory = searchParams.get("category") || "";
  const activeColor = searchParams.get("color") || "";
  const activeSize = searchParams.get("size") || "";
  const activeMinPrice = searchParams.get("minPrice") || "";
  const activeMaxPrice = searchParams.get("maxPrice") || "";

  useEffect(() => {
    api.get("/products/meta/filters").then((res) => setFilterMeta(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (activeCategory) params.category = activeCategory;
    if (activeColor) params.color = activeColor;
    if (activeSize) params.size = activeSize;
    if (activeMinPrice) params.minPrice = activeMinPrice;
    if (activeMaxPrice) params.maxPrice = activeMaxPrice;

    api
      .get("/products", { params })
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }, [activeCategory, activeColor, activeSize, activeMinPrice, activeMaxPrice]);

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  };

  const clearAll = () => setSearchParams({}, { replace: true });

  const activeCount = [activeCategory, activeColor, activeSize, activeMinPrice, activeMaxPrice].filter(
    Boolean
  ).length;

  const filterPanel = (
    <div className="space-y-7">
      <div>
        <p className="label-text">Category</p>
        <div className="flex flex-wrap gap-2">
          <FilterPill active={!activeCategory} onClick={() => updateFilter("category", "")}>
            All
          </FilterPill>
          {categories.map((c) => (
            <FilterPill key={c._id} active={activeCategory === c.slug} onClick={() => updateFilter("category", c.slug)}>
              {c.name}
            </FilterPill>
          ))}
        </div>
      </div>

      {filterMeta.sizes.length > 0 && (
        <div>
          <p className="label-text">Size</p>
          <div className="flex flex-wrap gap-2">
            <FilterPill active={!activeSize} onClick={() => updateFilter("size", "")}>
              All
            </FilterPill>
            {filterMeta.sizes.map((s) => (
              <FilterPill key={s} active={activeSize === s} onClick={() => updateFilter("size", s)}>
                {s}
              </FilterPill>
            ))}
          </div>
        </div>
      )}

      {filterMeta.colors.length > 0 && (
        <div>
          <p className="label-text">Color</p>
          <div className="flex flex-wrap gap-2">
            <FilterPill active={!activeColor} onClick={() => updateFilter("color", "")}>
              All
            </FilterPill>
            {filterMeta.colors.map((c) => (
              <FilterPill key={c} active={activeColor === c} onClick={() => updateFilter("color", c)}>
                {c}
              </FilterPill>
            ))}
          </div>
        </div>
      )}

      {filterMeta.maxPrice > 0 && (
        <div>
          <p className="label-text">Price range</p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              placeholder={String(filterMeta.minPrice)}
              value={activeMinPrice}
              onChange={(e) => updateFilter("minPrice", e.target.value)}
              className="input-field"
            />
            <span className="text-ink-faint">–</span>
            <input
              type="number"
              min={0}
              placeholder={String(filterMeta.maxPrice)}
              value={activeMaxPrice}
              onChange={(e) => updateFilter("maxPrice", e.target.value)}
              className="input-field"
            />
          </div>
          <p className="mt-1.5 text-xs text-ink-faint">
            Range: {formatPrice(filterMeta.minPrice)} – {formatPrice(filterMeta.maxPrice)}
          </p>
        </div>
      )}

      {activeCount > 0 && (
        <button onClick={clearAll} className="text-xs font-semibold text-brand hover:underline">
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <section id="products" className="scroll-mt-20 py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex items-end justify-between">
          <div>
            <span className="section-eyebrow">Shop</span>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">All products</h2>
          </div>
          <button
            onClick={() => setFiltersOpen(true)}
            className="btn-secondary lg:hidden"
          >
            Filters {activeCount > 0 && `(${activeCount})`}
          </button>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block">{filterPanel}</aside>

          <div>
            {loading ? (
              <p className="text-ink-soft">Loading products…</p>
            ) : products.length === 0 ? (
              <p className="text-ink-soft">No products match these filters.</p>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 lg:hidden">
          <div className="h-full w-80 max-w-[85vw] overflow-y-auto bg-surface p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Filters</h3>
              <button onClick={() => setFiltersOpen(false)} className="text-ink-soft">✕</button>
            </div>
            <div className="mt-6">{filterPanel}</div>
            <button onClick={() => setFiltersOpen(false)} className="btn-primary mt-8 w-full">
              Show results
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function FilterPill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border-brand bg-brand/10 text-brand"
          : "border-line text-ink-soft hover:border-brand hover:text-brand"
      }`}
    >
      {children}
    </button>
  );
}
