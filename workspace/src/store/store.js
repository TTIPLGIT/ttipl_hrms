import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "../pages/user/userSlice";
import loginReducer from "../pages/login/loginSlice";
import themeReducer from "../themeSlice";
import emailReducer from "../pages/forgotPassword/emailSlice"; // Import the email reducer
import storage from "redux-persist/lib/storage/session";
import { persistReducer, persistStore } from "redux-persist";
import otpReducer from "../pages/forgotPassword/otpSlice";
import attendanceReducer from "../hrms/pages/attendance/attendanceSlice";
const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  user: userReducer,
  login: loginReducer,
  theme: themeReducer,
  email: emailReducer,
  otp: otpReducer,
  attendance: attendanceReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
