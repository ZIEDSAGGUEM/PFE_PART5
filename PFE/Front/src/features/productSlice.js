import { createSlice } from "@reduxjs/toolkit";

// appApi
import appApi from "../services/appApi";

const initialState = [];

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    updateProducts: (state, action) => {
      // Use Immer to handle state changes in a mutable way
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      appApi.endpoints.createProduct.matchFulfilled,
      (_, { payload }) => payload
    );
    builder.addMatcher(
      appApi.endpoints.updateProduct.matchFulfilled,
      (_, { payload }) => payload
    );
    builder.addMatcher(
      appApi.endpoints.deleteProduct.matchFulfilled,
      (_, { payload }) => payload
    );
  },
});

export const { updateProducts } = productSlice.actions;
export default productSlice.reducer;
