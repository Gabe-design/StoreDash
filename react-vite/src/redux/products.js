// Action types
const SET_PRODUCTS = 'products/setProducts';
const CLEAR_PRODUCTS = 'products/clearProducts';

// Action creators
const setProducts = (products) => ({
  type: SET_PRODUCTS,
  payload: products
});

export const clearProducts = () => ({
  type: CLEAR_PRODUCTS
});

// Thunks
export const thunkGetProducts = () => async (dispatch) => {
  const response = await fetch("/api/products");

  if (response.ok) {
    const data = await response.json();
    if (data.errors) {
      return;
    }
    dispatch(setProducts(data.products));
  }
};

// Initial state
const initialState = { list: [] };

// Reducer
export default function productsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PRODUCTS:
      return { ...state, items: action.payload };
    case CLEAR_PRODUCTS:
      return { ...state, items: [] };
    default:
      return state;
  }
}
