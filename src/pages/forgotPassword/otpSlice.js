// src/store/otpSlice.js
import { createSlice } from "@reduxjs/toolkit";

const otpSlice = createSlice({
  name: "otp",
  initialState: {
    otp: Array(6).fill(""),
    email: "",
    timeLeft: 60, // 10 minutes in seconds
  },
  reducers: {
    setOtp(state, action) {
      state.otp = action.payload;
    },

    decrementTime(state) {
      if (state.timeLeft > 0) {
        state.timeLeft -= 1;
      }
    },
    resetTime(state) {
      state.timeLeft = 60; // Reset time
    },
  },
});

export const { setOtp, setEmail, decrementTime, resetTime } = otpSlice.actions;
export default otpSlice.reducer;
