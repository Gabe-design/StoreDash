// Action types
const SET_ORDERS = 'orders/setOrders';
const CLEAR_ORDERS = 'orders/clearOrders';

// Action creators
const setOrders = (orders) => ({
  // This will create an action to set the orders
  type: SET_ORDERS,
  // This will set the payload of the action to the orders
  payload: orders
});

export const clearOrders = () => ({
  // This will create an action to clear the orders
  type: CLEAR_ORDERS
});

// Thunks
export const thunkGetOrders = () => async (dispatch) => {
  // This will fetch the orders from the server
  const response = await fetch("/api/orders");
  // This will check if the response is ok
  if (response.ok) {
    // This will parse the response as JSON
    const data = await response.json();
    // This will check if there are any errors in the response
    if (data.errors) return;
    // This will dispatch the action to set the orders in the state
    dispatch(setOrders(data.orders));
  }
};

// Initial state
const initialState = { list: [] };

// Reducer
export default function ordersReducer(state = initialState, action) {
  // This will handle the actions related to orders
  switch (action.type) {
    // This will set the orders in the state
    case SET_ORDERS:
      // This will return a new state with the orders set
      return { ...state, items: action.payload };
    // This will clear the orders from the state
    case CLEAR_ORDERS:
      // This will return a new state with the orders cleared
      return { ...state, items: [] };
    // This will return the current state for any other action
    default:
      // This will return the current state if the action type is not recognized
      return state;
  }
}
