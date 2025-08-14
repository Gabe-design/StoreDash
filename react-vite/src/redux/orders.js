// Action types
const SET_ORDERS = 'orders/setOrders';
const CLEAR_ORDERS = 'orders/clearOrders';

// Action creators
const setOrders = (orders) => ({
  type: SET_ORDERS,
  payload: orders
});

export const clearOrders = () => ({
  type: CLEAR_ORDERS
});

// Thunks
export const thunkGetOrders = () => async (dispatch) => {
  const response = await fetch("/api/orders");
  if (response.ok) {
    const data = await response.json();
    if (data.errors) return;
    dispatch(setOrders(data.orders));
  }
};

// Initial state
const initialState = { list: [] };

// Reducer
export default function ordersReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ORDERS:
      return { ...state, items: action.payload };
    case CLEAR_ORDERS:
      return { ...state, items: [] };
    default:
      return state;
  }
}
