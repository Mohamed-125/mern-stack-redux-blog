import {
  configureStore,
  isRejected,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import apiSlice from "../slices/apiSlice";
import authSlice, { logout } from "../slices/authSlice";

const rtkQueryErrorLogger = (api) => (next) => (action) => {
  // isRejectedWithValue Or isRejected
  if (isRejected(action)) {
    console.log(action);
    if (action.payload?.originalStatus === 401) {
      api.dispatch(logout());
    }
  }

  return next(action);
};

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,
  },
  middleware: (getdefaultMiddleware) =>
    getdefaultMiddleware()
      .concat(apiSlice.middleware)
      .concat(rtkQueryErrorLogger),
  middlewareExtraArgument: {
    dispatch: () => {}, // Guard against store being undefined
  },
});

export default store;
