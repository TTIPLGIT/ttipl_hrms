// emailSlice.js
import { createSlice } from "@reduxjs/toolkit";

const emailSlice = createSlice({
  name: "email",
  initialState: { email: "", userId: null }, // Add userId to the initial state
  reducers: {
    setEmail(state, action) {
      state.email = action.payload;
    },
    clearEmail(state) {
      state.email = "";
    },
    setUserId(state, action) {
      state.userId = action.payload; // Action to set user ID
    },
    clearUserId(state) {
      state.userId = null; // Action to clear user ID
    },
  },
});

// Export actions
export const { setEmail, clearEmail, setUserId, clearUserId } =
  emailSlice.actions;

// Export the reducer
export default emailSlice.reducer;
