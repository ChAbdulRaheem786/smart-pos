import Hero from "../../components/user/Hero";
import FeaturedStack from "../../components/user/FeaturedStack";
import AboutSection from "../../components/user/AboutSection";
import ProductsSection from "../../components/user/ProductsSection";

export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturedStack />
      <AboutSection />
      <ProductsSection />
    </div>
  );
}
