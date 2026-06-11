import { useEffect, useState } from "react";
import { useParams, Link, Outlet, useLocation } from "react-router-dom";
import "./PublicProduct.css";

export default function PublicProduct() {
  const { storeName, productId } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [store, setStore] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/public/stores/${storeName}`)
      .then((res) => {
        if (!res.ok) { setError(true); return null; }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setStore(data.store);
          const found = data.products.find((p) => p.id === parseInt(productId));
          if (!found) setError(true);
          else setProduct(found);
        }
      })
      .catch(() => setError(true));
  }, [storeName, productId]);

  if (error) {
    return (
      <div className="public-product-error">
        <p>Product not found.</p>
        <Link to={`/store/${storeName}`}>← Back to store</Link>
      </div>
    );
  }

  if (!product) return <p className="public-product-loading">Loading...</p>;

  // Check if we're on a reviews sub-route so we can highlight the link
  const isOnReviews = location.pathname.includes("/reviews");

  return (
    <div className="public-product-page">
      <Link to={`/store/${storeName}`} className="public-product-back">
        ← {store?.name || "Back to store"}
      </Link>

      <div className="public-product-detail">
        {product.image_url && (
          <img
            src={product.image_url}
            alt={product.title}
            className="public-product-image"
          />
        )}
        <div className="public-product-info">
          <h1 className="public-product-title">{product.title}</h1>
          <p className="public-product-price">${product.price}</p>
          {product.description && (
            <p className="public-product-description">{product.description}</p>
          )}
          {product.tags?.length > 0 && (
            <div className="public-product-tags">
              {product.tags.map((tag) => (
                <span key={tag} className="public-product-tag">{tag}</span>
              ))}
            </div>
          )}
          {product.in_stock ? (
            <span className="public-product-stock in-stock">✔ In stock</span>
          ) : (
            <span className="public-product-stock out-of-stock">✘ Out of stock</span>
          )}
        </div>
      </div>

      <div className="public-product-reviews-section">
        {!isOnReviews && (
          <Link
            to={`/store/${storeName}/product/${productId}/reviews`}
            className="public-product-reviews-link"
          >
            Read Reviews
          </Link>
        )}
        <Outlet />
      </div>
    </div>
  );
}
