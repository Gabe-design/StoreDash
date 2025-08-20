// Action types
const SET_ORDERS = 'orders/setOrders';
const SET_ORDER = 'orders/setOrder';
const CLEAR_ORDERS = 'orders/clearOrders';
const DELETE_ORDER = 'orders/deleteOrder';

// Action creators
const setOrders = (orders) => ({
  // This will create an action to set the orders list
  type: SET_ORDERS,
  // This will set the payload of the action to the orders
  payload: orders
});

const setOrder = (order) => ({
  // This will create an action to set a single order (current)
  type: SET_ORDER,
  // This will set the payload of the action to the order
  payload: order
});

export const clearOrders = () => ({
  // This will create an action to clear the orders
  type: CLEAR_ORDERS
});

const removeOrder = (orderId) => ({
  // This will create an action to remove an order by id
  type: DELETE_ORDER,
  // This will set the payload of the action to the order id
  payload: orderId
});

// Thunks
export const thunkGetOrders = () => async (dispatch) => {
  // This will fetch all orders for the current user's store
  const response = await fetch("/api/orders", { credentials: "include" });
  if (response.ok) {
    const data = await response.json();
    if (data.errors) return;
    dispatch(setOrders(data.orders));
  }
};

export const thunkGetOrderById = (orderId) => async (dispatch) => {
  // This will fetch a single order by its id
  const response = await fetch(`/api/orders/${orderId}`, { credentials: "include" });
  if (response.ok) {
    const data = await response.json();
    if (data.errors) return;
    dispatch(setOrder(data.orders));
  }
};

export const thunkUpdateOrder = (orderId, status) => async (dispatch) => {
  // This will update the status of an order
  const response = await fetch(`/api/orders/${orderId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status })
  });
  if (response.ok) {
    const data = await response.json();
    if (data.errors) return;
    dispatch(setOrder(data.orders));
  }
};

export const thunkDeleteOrder = (orderId) => async (dispatch) => {
  // This will delete an order by id
  const response = await fetch(`/api/orders/${orderId}`, {
    method: "DELETE",
    credentials: "include"
  });
  if (response.ok) {
    const data = await response.json();
    if (data.errors) return;
    dispatch(removeOrder(orderId));
  }
};

export const thunkCreatePublicOrder = (storeName, payload) => async (dispatch) => {
  // This will create a new order for a public store
  const response = await fetch(`/api/public/stores/${storeName}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (response.ok) {
    const data = await response.json();
    if (data.errors) return;
    dispatch(setOrder(data.order));
    return data.order;
  }
};

// Initial state
const initialState = { 
  list: [],    // This will hold the list of orders
  current: {}  // This will hold a single current order
};

// Reducer
export default function ordersReducer(state = initialState, action) {
  // This will handle the actions related to orders
  switch (action.type) {
    case SET_ORDERS:
      // This will set the orders list in the state
      return { ...state, list: action.payload };
    case SET_ORDER:
      // This will set a single order in the state
      return { ...state, current: action.payload };
    case DELETE_ORDER:
      // This will remove an order from the list and clear current if matched
      return { 
        ...state, 
        list: state.list.filter((order) => order.id !== action.payload),
        current: state.current?.id === action.payload ? {} : state.current
      };
    case CLEAR_ORDERS:
      // This will clear all orders from the state
      return { ...state, list: [], current: {} };
    default:
      // This will return the current state if the action type is not recognized
      return state;
  }
}
