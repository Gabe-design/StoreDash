// Action types
const SET_IMAGE_URL = 'images/setImageUrl';
const CLEAR_IMAGE_URL = 'images/clearImageUrl';

// Action creators
const setImageUrl = (url) => ({
  type: SET_IMAGE_URL,
  payload: url
});

export const clearImageUrl = () => ({
  type: CLEAR_IMAGE_URL
});

// Thunks
export const thunkUploadImage = (file) => async (dispatch) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("/api/images/upload", {
    method: "POST",
    body: formData
  });

  if (response.ok) {
    const data = await response.json();
    if (data.errors) return data.errors;
    dispatch(setImageUrl(data.url));
    return data.url;
  } else {
    const errorData = await response.json();
    return errorData;
  }
};

// Initial state
const initialState = { url: null };

// Reducer
export default function imagesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_IMAGE_URL:
      return { ...state, url: action.payload };
    case CLEAR_IMAGE_URL:
      return { ...state, url: null };
    default:
      return state;
  }
}
