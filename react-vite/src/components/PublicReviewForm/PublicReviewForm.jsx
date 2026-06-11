import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  thunkGetReviews,
  thunkCreateReview,
  thunkUpdateReview,
  thunkDeleteReview,
} from "../../redux/reviews";
import "./PublicReviewForm.css";

export default function PublicReviewForm() {
  const { storeName, productId, reviewId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.session.user);
  const reviews = useSelector((state) => state.reviews.items);

  const existingReview = reviewId
    ? reviews.find((r) => r.id === parseInt(reviewId))
    : null;

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});

  // Load reviews if editing so we can find the existing review
  useEffect(() => {
    if (reviewId && reviews.length === 0) {
      dispatch(thunkGetReviews(productId));
    }
  }, [dispatch, reviewId, productId, reviews.length]);

  // Pre-fill form when existing review loads
  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment || "");
    }
  }, [existingReview]);

  if (!currentUser) {
    return (
      <div className="public-review-form">
        <p>
          You must be <Link to="/login">logged in</Link> to write a review.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    let result;
    if (reviewId) {
      result = await dispatch(thunkUpdateReview(reviewId, { rating, comment }));
    } else {
      result = await dispatch(
        thunkCreateReview({ product_id: parseInt(productId), rating, comment })
      );
    }

    if (result?.errors) {
      setErrors(result.errors);
    } else {
      navigate(`/store/${storeName}/product/${productId}/reviews`);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Delete this review?")) {
      await dispatch(thunkDeleteReview(reviewId));
      navigate(`/store/${storeName}/product/${productId}/reviews`);
    }
  };

  return (
    <div className="public-review-form">
      <h3 className="public-review-form-title">
        {reviewId ? "Edit Review" : "Write a Review"}
      </h3>

      <form onSubmit={handleSubmit} className="public-review-form-body">
        <label className="public-review-label">
          Rating
          <select
            className="public-review-select"
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} ★
              </option>
            ))}
          </select>
        </label>
        {errors.rating && <p className="public-review-error">{errors.rating}</p>}

        <label className="public-review-label">
          Comment
          <textarea
            className="public-review-textarea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            rows={4}
          />
        </label>
        {errors.comment && <p className="public-review-error">{errors.comment}</p>}

        <div className="public-review-form-actions">
          <button type="submit" className="public-review-submit-btn">
            {reviewId ? "Save Changes" : "Submit Review"}
          </button>
          {reviewId && (
            <button
              type="button"
              className="public-review-delete-btn"
              onClick={handleDelete}
            >
              Delete Review
            </button>
          )}
          <button
            type="button"
            className="public-review-cancel-btn"
            onClick={() =>
              navigate(`/store/${storeName}/product/${productId}/reviews`)
            }
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
