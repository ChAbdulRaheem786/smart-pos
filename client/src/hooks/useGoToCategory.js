import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export function scrollToProducts() {
  const el = document.getElementById("products");
  if (el) el.scrollIntoView({ block: "start" });
}

// Returns a function that filters the product grid by category (or clears the
// filter when slug is falsy) and smooth-scrolls to it — from any page.
export function useGoToCategory() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  return (slug) => {
    if (location.pathname === "/") {
      // Already home — just update the filter in place and scroll.
      const next = new URLSearchParams(searchParams);
      if (slug) next.set("category", slug);
      else next.delete("category");
      setSearchParams(next);
      requestAnimationFrame(scrollToProducts);
    } else {
      // Navigate home first, then scroll once the products section has mounted.
      navigate(slug ? `/?category=${slug}` : "/", { state: { scrollToProducts: true } });
    }
  };
}
