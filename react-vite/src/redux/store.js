import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";

import sessionReducer from "./session";
import storeReducer from "./storeSettings";
import productsReducer from "./products";
import ordersReducer from "./orders";
import reviewsReducer from "./reviews";
import imagesReducer from "./images";
import usersReducer from "./users";

// This is the root reducer that combines all the individual reducers
const rootReducer = combineReducers({
  session: sessionReducer,
  store: storeReducer,
  products: productsReducer,
  orders: ordersReducer,
  reviews: reviewsReducer,
  images: imagesReducer,
  users: usersReducer,
});

let enhancer;

if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
