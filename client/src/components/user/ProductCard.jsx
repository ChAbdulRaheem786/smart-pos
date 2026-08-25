import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/format";

export default function ProductCard({ product }) {
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const image = product.images?.[0]?.url;

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block overflow-hidden rounded-xl2 border border-line bg-surface shadow-card transition-all hover:-translate-y-1 hover:border-brand/50 hover:shadow-cardHover"
    >
      <div className="aspect-square w-full overflow-hidden bg-surface2">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink-faint text-sm">
            No image
          </div>
        )}
      </div>
      <div className="space-y-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-brand">
          {product.category?.name}
        </p>
        <h3 className="font-display text-base font-semibold leading-snug text-ink line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 pt-1">
          <span className="price-tag">{formatPrice(hasDiscount ? product.discountPrice : product.price)}</span>
          {hasDiscount && (
            <span className="text-xs text-ink-faint line-through">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
