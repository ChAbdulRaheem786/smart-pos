import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Hero from "../../components/user/Hero";
import FeaturedStack from "../../components/user/FeaturedStack";
import AboutSection from "../../components/user/AboutSection";
import ProductsSection from "../../components/user/ProductsSection";
import { scrollToProducts } from "../../hooks/useGoToCategory";

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  // If we were routed here from another page with a request to jump straight
  // to the products section (e.g. clicking a category from /product/:slug),
  // do that once the page has mounted, then clear the flag.
  useEffect(() => {
    if (location.state?.scrollToProducts) {
      requestAnimationFrame(scrollToProducts);
      navigate(location.pathname + location.search, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Hero />
      <FeaturedStack />
      <AboutSection />
      <ProductsSection />
    </div>
  );
}
