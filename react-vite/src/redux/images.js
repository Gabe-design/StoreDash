// Action types
const SET_IMAGE_URL = 'images/setImageUrl';
const CLEAR_IMAGE_URL = 'images/clearImageUrl';

// Action creators
const setImageUrl = (url) => ({
  // This will create an action to set the image URL
  type: SET_IMAGE_URL,
  // This will set the payload of the action to the URL
  payload: url
});

export const clearImageUrl = () => ({
  // This will create an action to clear the image URL
  type: CLEAR_IMAGE_URL
});

// Thunks
export const thunkUploadImage = (file) => async (dispatch) => {
  // This will handle the file upload for the image
  const formData = new FormData();
  // This will append the file to the FormData object
  formData.append("image", file);

  // This will send the file to the server
  const response = await fetch("/api/images/upload", {
    // This will use the POST method to upload the file
    method: "POST",
    // This will set the body of the request to the FormData object
    body: formData
  });

  // This will check if the response is ok
  if (response.ok) {
    // This will parse the response as JSON
    const data = await response.json();
    // This will check if there are any errors in the response
    if (data.errors) return data.errors;
    // This will dispatch the action to set the image URL in the state
    dispatch(setImageUrl(data.url));
    // This will return the image URL
    return data.url;
  // If the response is not ok, it will parse the error data
  } else {
    // This will parse the response as JSON
    const errorData = await response.json();
    // This will log the error to the console
    return errorData;
  }
};

// Initial state
const initialState = { url: null };

// Reducer
export default function imagesReducer(state = initialState, action) {
  // This will handle the actions related to images
  switch (action.type) {
    // This will set the image URL in the state
    case SET_IMAGE_URL:
      // This will return a new state with the image URL set
      return { ...state, url: action.payload };
    // This will clear the image URL from the state
    case CLEAR_IMAGE_URL:
      // This will return a new state with the image URL cleared
      return { ...state, url: null };
    // This will return the current state if the action type is not recognized
    default:
      // This will return the current state
      return state;
  }
}
