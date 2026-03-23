import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./reducers";
import rootSaga from "./sagas_native";

// Import redux-saga using require for better compatibility
const createSagaMiddleware = require("redux-saga").default;
const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];

// React Native doesn't have Redux DevTools Extension
const composeEnhancers = compose;

export function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  );
  sagaMiddleware.run(rootSaga);
  return store;
}

