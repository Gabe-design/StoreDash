// Action types
const SET_STORE = 'store/setStore';
const CLEAR_STORE = 'store/clearStore';

// Action creators
const setStore = (store) => ({
  // This will create an action to set the store
  type: SET_STORE,
  // This will set the payload of the action to the store
  payload: store
});

export const clearStore = () => ({
  // This will create an action to clear the store
  type: CLEAR_STORE
});

// Thunks
export const thunkCreateMyStore = (storeData) => async (dispatch) => {
  // This will send a request to create a new store
  const response = await fetch("/api/stores/", {
    // This will use the POST method to create the store
    method: "POST",
    // This will set the headers to indicate JSON content
    headers: { "Content-Type": "application/json" },
    // This will include credentials for the request
    credentials: "include",
    // This will set the body of the request to the store data
    body: JSON.stringify(storeData)
  });

  // This will check if the response is ok
  if (response.ok) {
    // This will parse the response as JSON
    const data = await response.json();
    // This will dispatch the action to set the store in the state
    dispatch(setStore(data.store));
    // This will return null if the creation was successful
    return null;
  // If the response is not ok, it will handle errors
  } else if (response.status < 500) {
    // This will parse the response as JSON to get error messages
    return await response.json();
  // If there is a server error, it will return a generic error message
  } else {
    // This will return a generic error message
    return { server: "Something went wrong. Please try again" };
  }
};


export const thunkGetMyStore = () => async (dispatch) => {
  // This will fetch the current user's store
  const response = await fetch("/api/stores/me", {
    // This will use the GET method to retrieve the store
    credentials: "include" 
  });
  // This will check if the response is ok
  if (response.ok) {
    // This will parse the response as JSON
    const data = await response.json();
    // This will check if there are any errors in the response
    if (data.errors) return;
    // This will dispatch the action to set the store in the state
    dispatch(setStore(data.store));
  }
};

export const thunkUpdateMyStore = (storeData) => async (dispatch) => {
  // This will update the current user's store with the provided data
  const response = await fetch("/api/stores/me", {
    // This will use the PUT method to update the store
    method: "PUT",
    // This will set the headers to indicate JSON content
    headers: { "Content-Type": "application/json" },
    // This will include credentials for the request
    credentials: "include", 
    // This will set the body of the request to the store data
    body: JSON.stringify(storeData)

  });
  // This will check if the response is ok
  if (response.ok) {
    // This will parse the response as JSON
    const data = await response.json();
    // This will check if there are any errors in the response
    dispatch(setStore(data.store));
    // This will return null if the update was successful
    return null;
  // If the response is not ok, it will handle errors
  } else if (response.status < 500) {
    // This will parse the response as JSON to get error messages
    return await response.json();
  // If there is a server error, it will return a generic error message
  } else {
    // This will return a generic error message
    return { server: "Something went wrong. Please try again" };
  }
};

// This will delete the current user's store
export const thunkDeleteMyStore = () => async (dispatch) => {
  // This will send a request to delete the store
  const response = await fetch("/api/stores/me", {
    // This will use the DELETE method to remove the store
    method: "DELETE",
    // This will include credentials for the request
    credentials: "include"

  });

  // This will check if the response is ok
  if (response.ok) {
    // This will parse the response as JSON
    dispatch(clearStore());
    // This will return null if the deletion was successful
    return null;
  // If the response is not ok, it will handle errors
  } else if (response.status < 500) {
    // This will parse the response as JSON to get error messages
    return await response.json();
  // If there is a server error, it will return a generic error message
  } else {
    // This will return a generic error message
    return { server: "Something went wrong. Please try again" };
  }
};

// Initial state
const initialState = { current: null };

// Reducer
export default function storeReducer(state = initialState, action) {
  // This will handle the actions related to the store
  switch (action.type) {
    // This will set the store in the state
    case SET_STORE:
      // This will return a new state with the store set
      return { ...state, current: action.payload };
    // This will clear the store from the state
    case CLEAR_STORE:
      // This will return a new state with the store cleared
      return { ...state, current: null };
    // This will return the current state for any other action
    default:
      // This will return the current state if the action type is not recognized
      return state;
  }
}
