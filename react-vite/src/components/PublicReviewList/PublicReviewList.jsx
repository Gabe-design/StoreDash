import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetReviews } from "../../redux/reviews";
import "./PublicReviewForm.css";

export default function PublicReviewList() {
  const { storeName, productId } = useParams();
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviews.items);
  const currentUser = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(thunkGetReviews(productId));
  }, [dispatch, productId]);

  const avgRating =
    reviews.length
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="public-review-list">
      <div className="public-review-list-header">
        <h3 className="public-review-list-title">
          Customer Reviews
          {avgRating && (
            <span className="public-review-avg"> · ★ {avgRating} ({reviews.length})</span>
          )}
        </h3>
        {currentUser ? (
          <Link
            to={`/store/${storeName}/product/${productId}/reviews/new`}
            className="public-review-write-btn"
          >
            Write a Review
          </Link>
        ) : (
          <Link to="/login" className="public-review-login-link">
            Log in to leave a review
          </Link>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="public-review-empty">No reviews yet. Be the first!</p>
      ) : (
        <ul className="public-review-items">
          {reviews.map((review) => (
            <li key={review.id} className="public-review-item">
              <div className="public-review-rating">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>
              {review.comment && (
                <p className="public-review-comment">{review.comment}</p>
              )}
              <p className="public-review-date">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
              {currentUser?.id === review.user_id && (
                <Link
                  to={`/store/${storeName}/product/${productId}/reviews/${review.id}/edit`}
                  className="public-review-edit-link"
                >
                  Edit
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
