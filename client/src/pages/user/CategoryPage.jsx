import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Category links (old bookmarks, external links) land here and get redirected
// into the single filterable products section on the homepage.
export default function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/?category=${slug}`, { replace: true, state: { scrollToProducts: true } });
  }, [slug, navigate]);

  return null;
}
