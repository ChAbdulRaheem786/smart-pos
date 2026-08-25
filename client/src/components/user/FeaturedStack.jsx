import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios";
import { formatPrice } from "../../utils/format";

const STACK_SIZE = 3; // how many cards are visibly stacked behind the front card

export default function FeaturedStack() {
  const [products, setProducts] = useState([]);
  const [order, setOrder] = useState([]); // indices into `products`, front card = order[0]
  const [flyingCard, setFlyingCard] = useState(null); // { key, product, direction }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/products", { params: { featured: true } })
      .then((res) => {
        setProducts(res.data);
        setOrder(res.data.map((_, i) => i));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || products.length === 0) return null;

  // direction: 1 = swipe right, -1 = swipe left. The card currently on top flies
  // off in that direction while the stack underneath instantly reorders, so the
  // next card is already sliding into the front position as the old one exits.
  const triggerSwipe = (direction) => {
    if (order.length === 0) return;
    const frontIdx = order[0];
    setFlyingCard({ key: `${frontIdx}-${Date.now()}`, product: products[frontIdx], direction });
    setOrder((prev) => [...prev.slice(1), prev[0]]);
    setTimeout(() => setFlyingCard(null), 400);
  };

  const visible = order.slice(0, Math.min(STACK_SIZE, products.length));

  return (
    <section className="border-b border-line py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center">
          <span className="section-eyebrow">Featured</span>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Hand-picked for you</h2>
          <p className="mt-2 text-ink-soft">Tap or drag a card to see what's next.</p>
        </div>

        <div className="relative mx-auto mt-12 h-[420px] w-full max-w-sm sm:h-[460px]">
          {visible.map((idx, stackPos) => {
            const product = products[idx];
            const isFront = stackPos === 0;
            return (
              <motion.div
                key={product._id}
                className="absolute inset-0"
                style={{ zIndex: STACK_SIZE - stackPos }}
                animate={{
                  scale: 1 - stackPos * 0.05,
                  y: stackPos * 14,
                  opacity: 1 - stackPos * 0.15,
                }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                drag={isFront ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(e, info) => {
                  if (Math.abs(info.offset.x) > 100) {
                    triggerSwipe(info.offset.x > 0 ? 1 : -1);
                  }
                }}
              >
                <FeaturedCard product={product} onSwipe={isFront ? () => triggerSwipe(1) : undefined} />
              </motion.div>
            );
          })}

          {/* Ghost card that plays the fly-away animation, decoupled from the
              stack above so the swipe always plays regardless of stack size. */}
          <AnimatePresence>
            {flyingCard && (
              <motion.div
                key={flyingCard.key}
                className="absolute inset-0 pointer-events-none"
                style={{ zIndex: STACK_SIZE + 1 }}
                initial={{ x: 0, rotate: 0, opacity: 1, scale: 1 }}
                animate={{ x: flyingCard.direction * 420, rotate: flyingCard.direction * 20, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeIn" }}
              >
                <FeaturedCard product={flyingCard.product} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function FeaturedCard({ product, onSwipe }) {
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const image = product.images?.[0]?.url;

  return (
    <div
      onClick={onSwipe}
      className={`flex h-full w-full flex-col overflow-hidden rounded-xl2 border border-line bg-surface shadow-card ${
        onSwipe ? "cursor-pointer" : ""
      }`}
    >
      <div className="relative h-2/3 w-full overflow-hidden bg-surface2">
        {image ? (
          <img src={image} alt={product.name} className="h-full w-full select-none object-cover" draggable={false} />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink-faint text-sm">No image</div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-bg">
          Featured
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-brand">{product.category?.name}</p>
          <h3 className="mt-1 font-display text-lg font-semibold leading-snug">{product.name}</h3>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="price-tag">{formatPrice(hasDiscount ? product.discountPrice : product.price)}</span>
            {hasDiscount && <span className="text-xs text-ink-faint line-through">{formatPrice(product.price)}</span>}
          </div>
          <Link
            to={`/product/${product.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="text-xs font-semibold text-brand hover:underline"
          >
            View &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
