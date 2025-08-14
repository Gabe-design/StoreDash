// Action types
const SET_REVIEWS = 'reviews/setReviews';
const ADD_REVIEW = 'reviews/addReview';
const UPDATE_REVIEW = 'reviews/updateReview';
const DELETE_REVIEW = 'reviews/deleteReview';
const CLEAR_REVIEWS = 'reviews/clearReviews';

// Action creators
const setReviews = (reviews) => ({
  type: SET_REVIEWS,
  payload: reviews
});

const addReview = (review) => ({
  type: ADD_REVIEW,
  payload: review
});

const updateReviewAction = (review) => ({
  type: UPDATE_REVIEW,
  payload: review
});

const deleteReviewAction = (id) => ({
  type: DELETE_REVIEW,
  payload: id
});

export const clearReviews = () => ({
  type: CLEAR_REVIEWS
});

// Thunks
export const thunkGetReviews = (productId) => async (dispatch) => {
  const response = await fetch(`/api/reviews/product/${productId}`);

  if (response.ok) {
    const data = await response.json();
    if (data.errors) return;
    dispatch(setReviews(data.reviews)); // { reviews: [...] }
  }
};

export const thunkCreateReview = (reviewData) => async (dispatch) => {
  const response = await fetch(`/api/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reviewData)
  });

  if (response.ok) {
    const data = await response.json();
    if (data.errors) return data.errors;
    dispatch(addReview(data.review)); // { review: {...} }
  } else {
    const errorData = await response.json();
    return errorData;
  }
};

export const thunkUpdateReview = (id, reviewData) => async (dispatch) => {
  const response = await fetch(`/api/reviews/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reviewData)
  });

  if (response.ok) {
    const data = await response.json();
    if (data.errors) return data.errors;
    dispatch(updateReviewAction(data.review));
  } else {
    const errorData = await response.json();
    return errorData;
  }
};

export const thunkDeleteReview = (id) => async (dispatch) => {
  const response = await fetch(`/api/reviews/${id}`, {
    method: "DELETE"
  });

  if (response.ok) {
    const data = await response.json();
    if (data.errors) return data.errors;
    dispatch(deleteReviewAction(id));
  }
};

// Initial state
const initialState = { items: [] };

// Reducer
export default function reviewsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_REVIEWS:
      return { ...state, items: action.payload };
    case ADD_REVIEW:
      return { ...state, items: [...state.items, action.payload] };
    case UPDATE_REVIEW:
      return {
        ...state,
        items: state.items.map((review) =>
          review.id === action.payload.id ? action.payload : review
        )
      };
    case DELETE_REVIEW:
      return {
        ...state,
        items: state.items.filter((review) => review.id !== action.payload)
      };
    case CLEAR_REVIEWS:
      return { ...state, items: [] };
    default:
      return state;
  }
}
