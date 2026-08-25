import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/format";

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [activeImage, setActiveImage] = useState(0);
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState("");

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setActiveImage(0);
    setColor("");
    setSize("");
    setQuantity(1);

    api
      .get(`/products/${slug}`)
      .then((res) => setProduct(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="mx-auto max-w-6xl px-5 py-24 text-center text-ink-soft">Loading…</div>;

  if (notFound || !product) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-24 text-center">
        <p className="text-ink-soft">We couldn't find that product.</p>
        <Link to="/" className="mt-4 inline-block text-brand-dark underline">
          Back to shop
        </Link>
      </div>
    );
  }

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const unitPrice = hasDiscount ? product.discountPrice : product.price;

  const buildItem = () => ({
    productId: product._id,
    name: product.name,
    price: unitPrice,
    color,
    size,
    quantity,
    image: product.images?.[0]?.url || "",
  });

  const handleAddToCart = () => {
    if (product.colors?.length && !color) return setToast("Please choose a color.");
    if (product.sizes?.length && !size) return setToast("Please choose a size.");
    addItem(buildItem());
    setToast("Added to cart.");
    setTimeout(() => setToast(""), 1800);
  };

  const handleBuyNow = () => {
    if (product.colors?.length && !color) return setToast("Please choose a color.");
    if (product.sizes?.length && !size) return setToast("Please choose a size.");
    addItem(buildItem());
    navigate("/checkout");
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 pb-24">
      <Link to="/" className="text-sm text-ink-soft hover:text-ink">
        &larr; Back to shop
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="aspect-square w-full overflow-hidden rounded-xl2 border border-line bg-line/40">
            {product.images?.[activeImage] ? (
              <img
                src={product.images[activeImage].url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-ink-soft/40">
                No image
              </div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={img.publicId}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${
                    i === activeImage ? "border-ink" : "border-transparent"
                  }`}
                >
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-brand-dark">
            {product.category?.name}
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">{product.name}</h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="price-tag text-base">{formatPrice(unitPrice)}</span>
            {hasDiscount && (
              <span className="text-sm text-ink-soft/50 line-through">{formatPrice(product.price)}</span>
            )}
          </div>

          {product.description && (
            <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
              {product.description}
            </p>
          )}

          {product.colors?.length > 0 && (
            <div className="mt-6">
              <p className="label-text">Color</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                      color === c
                        ? "border-ink bg-ink text-paper"
                        : "border-line bg-white text-ink hover:border-ink"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes?.length > 0 && (
            <div className="mt-5">
              <p className="label-text">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                      size === s
                        ? "border-ink bg-ink text-paper"
                        : "border-line bg-white text-ink hover:border-ink"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5">
            <p className="label-text">Quantity</p>
            <div className="inline-flex items-center rounded-full border border-line">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3.5 py-2 text-lg leading-none hover:text-brand-dark"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3.5 py-2 text-lg leading-none hover:text-brand-dark"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {toast && <p className="mt-4 text-sm font-medium text-brand-dark">{toast}</p>}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button onClick={handleBuyNow} className="btn-primary flex-1">
              Order now
            </button>
            <button onClick={handleAddToCart} className="btn-secondary flex-1">
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
