// Action types
const SET_STORE = 'store/setStore';
const CLEAR_STORE = 'store/clearStore';

// Action creators
const setStore = (store) => ({
  type: SET_STORE,
  payload: store
});

export const clearStore = () => ({
  type: CLEAR_STORE
});

// Thunks
export const thunkGetMyStore = () => async (dispatch) => {
  const response = await fetch("/api/stores/me");
  if (response.ok) {
    const data = await response.json();
    if (data.errors) return;
    dispatch(setStore(data.store));
  }
};

export const thunkUpdateMyStore = (storeData) => async (dispatch) => {
  const response = await fetch("/api/stores/me", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(storeData)
  });
  if (response.ok) {
    const data = await response.json();
    dispatch(setStore(data.store));
    return null;
  } else if (response.status < 500) {
    return await response.json();
  } else {
    return { server: "Something went wrong. Please try again" };
  }
};

// Initial state
const initialState = { current: null };

// Reducer
export default function storeReducer(state = initialState, action) {
  switch (action.type) {
    case SET_STORE:
      return { ...state, current: action.payload };
    case CLEAR_STORE:
      return { ...state, current: null };
    default:
      return state;
  }
}
