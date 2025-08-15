// Action types
const SET_PRODUCTS = 'products/setProducts';
const CLEAR_PRODUCTS = 'products/clearProducts';

// Action creators
const setProducts = (products) => ({
  // This will create an action to set the products
  type: SET_PRODUCTS,
  // This will set the payload of the action to the products
  payload: products
});

export const clearProducts = () => ({
  // This will create an action to clear the products
  type: CLEAR_PRODUCTS
});

// Thunks
export const thunkGetProducts = () => async (dispatch) => {
  // This will fetch the products from the server
  const response = await fetch("/api/products");

  // This will check if the response is ok
  if (response.ok) {
    // This will parse the response as JSON
    const data = await response.json();
    // This will check if there are any errors in the response
    if (data.errors) {
      // If there are errors, it will return early
      return;
    }
    // This will dispatch the action to set the products in the state
    dispatch(setProducts(data.products));
  }
};

// Initial state
const initialState = { list: [] };

// Reducer
export default function productsReducer(state = initialState, action) {
  // This will handle the actions related to products
  switch (action.type) {
    // This will set the products in the state
    case SET_PRODUCTS:
      // This will return a new state with the products set
      return { ...state, items: action.payload };
    // This will clear the products from the state
    case CLEAR_PRODUCTS:
      // This will return a new state with the products cleared
      return { ...state, items: [] };
    // This will return the current state for any other action
    default:
      // This will return the current state if the action type is not recognized
      return state;
  }
}
