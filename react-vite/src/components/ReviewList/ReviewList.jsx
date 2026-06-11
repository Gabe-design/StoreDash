import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetReviews, thunkDeleteReview } from "../../redux/reviews";
import { thunkGetProducts } from "../../redux/products";
import "./ReviewList.css";

export default function ReviewList() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviews.items);
  const currentUser = useSelector((state) => state.session.user);
  const products = useSelector((state) => state.products.list);

  useEffect(() => {
    if (productId) {
      dispatch(thunkGetReviews(productId));
    } else {
      dispatch(thunkGetProducts());
    }
  }, [dispatch, productId]);

  const handleDelete = (reviewId) => {
    if (window.confirm("Delete this review?")) {
      dispatch(thunkDeleteReview(reviewId));
    }
  };

  // No productId: show all products so user can navigate to a product's reviews
  if (!productId) {
    return (
      <div className="review-list-page">
        <h2 className="review-list-title">Reviews</h2>
        <p className="review-list-subtitle">Select a product to view and manage its reviews.</p>
        {products.length === 0 ? (
          <p className="review-list-empty">
            No products yet.{" "}
            <Link to="/dashboard/products/new">Add a product</Link> to start collecting reviews.
          </p>
        ) : (
          <ul className="review-list-products">
            {products.map((product) => (
              <li key={product.id} className="review-list-product-item">
                {product.image_url && (
                  <img src={product.image_url} alt={product.title} className="review-list-product-image" />
                )}
                <span className="review-list-product-name">{product.title}</span>
                <Link
                  to={`/dashboard/products/${product.id}/reviews`}
                  className="review-list-view-btn"
                >
                  View Reviews
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="review-list-page">
      <Link to="/dashboard/reviews" className="review-list-back">← Back to Products</Link>
      <h2 className="review-list-title">Reviews</h2>

      {reviews.length === 0 ? (
        <p className="review-list-empty">No reviews yet for this product.</p>
      ) : (
        <ul className="review-list-items">
          {reviews.map((review) => (
            <li key={review.id} className="review-list-item">
              <div className="review-list-rating">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>
              {review.comment && (
                <p className="review-list-comment">{review.comment}</p>
              )}
              <p className="review-list-date">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
              {currentUser?.id === review.user_id && (
                <button
                  className="review-list-delete"
                  onClick={() => handleDelete(review.id)}
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
