// Action types
const SET_PRODUCTS = 'products/setProducts';
const CLEAR_PRODUCTS = 'products/clearProducts';
const ADD_PRODUCT = 'products/addProduct';
const UPDATE_PRODUCT = 'products/updateProduct';
const DELETE_PRODUCT = 'products/deleteProduct';

// Action creators
const setProducts = (products) => ({
  // This will create an action to set the products in state
  type: SET_PRODUCTS,
  // This will set the payload of the action to the products array
  payload: products
});

export const clearProducts = () => ({
  // This will create an action to clear all products from state
  type: CLEAR_PRODUCTS
});

const addProduct = (product) => ({
  // This will create an action to add a new product to the list
  type: ADD_PRODUCT,
  // This will set the payload of the action to the new product
  payload: product
});

const updateProduct = (product) => ({
  // This will create an action to update an existing product in the list
  type: UPDATE_PRODUCT,
  // This will set the payload of the action to the updated product
  payload: product
});

const removeProduct = (productId) => ({
  // This will create an action to remove a product by its ID
  type: DELETE_PRODUCT,
  // This will set the payload of the action to the product ID
  payload: productId
});

// Thunks
export const thunkGetProducts = () => async (dispatch) => {
  // This will fetch the products from the server
  const response = await fetch("/api/products");

  if (response.ok) {
    const data = await response.json();
    if (!data.errors) {
      // This will dispatch the action to set the products in state
      dispatch(setProducts(data.products));
    }
  }
};

export const thunkAddProduct = (productData) => async (dispatch) => {
  // This will send a POST request to create a new product
  // productData should include: title, price, description, image_url, and tags (array of strings)
  const response = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });

  if (response.ok) {
    const data = await response.json();
    if (data.products) {
      // This will dispatch the action to add the product in state
      dispatch(addProduct(data.products));
      return null; // no errors
    }
  } else {
    const errorData = await response.json();
    return errorData.errors || { message: "Failed to create product." };
  }
};

export const thunkUpdateProduct = (productId, productData) => async (dispatch) => {
  // This will send a PUT request to update an existing product
  // productData should include: title, price, description, image_url, and tags (array of strings)
  const response = await fetch(`/api/products/${productId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });

  if (response.ok) {
    const data = await response.json();
    if (data.products) {
      // This will dispatch the action to update the product in state
      dispatch(updateProduct(data.products));
      return null; // no errors
    }
  } else {
    const errorData = await response.json();
    return errorData.errors || { message: "Failed to update product." };
  }
};

export const thunkDeleteProduct = (productId) => async (dispatch) => {
  // This will send a DELETE request to remove a product by its ID
  const response = await fetch(`/api/products/${productId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    const data = await response.json();
    if (data.message === "Product Deleted.") {
      // This will dispatch the action to remove the product from state
      dispatch(removeProduct(productId));
    }
  }
};

// Reducer
export default function productsReducer(state = { list: [] }, action) {
  // This will handle the actions related to products
  switch (action.type) {
    case SET_PRODUCTS:
      // This will set the list of products in state
      return { ...state, list: action.payload };
    case CLEAR_PRODUCTS:
      // This will clear the list of products from state
      return { ...state, list: [] };
    case ADD_PRODUCT:
      // This will add the new product to the list
      return { ...state, list: [...state.list, action.payload] };
    case UPDATE_PRODUCT:
      // This will replace the old product with the updated one
      return {
        ...state,
        list: state.list.map((product) =>
          product.id === action.payload.id ? action.payload : product
        ),
      };
    case DELETE_PRODUCT:
      // This will filter out the deleted product from the list
      return {
        ...state,
        list: state.list.filter((product) => product.id !== action.payload),
      };
    default:
      // This will return the current state if the action type is not recognized
      return state;
  }
}
