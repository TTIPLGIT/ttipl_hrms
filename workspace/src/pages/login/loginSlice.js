import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const generateAccessToken = createAsyncThunk(
  "login/generateAccessToken",
  async function generateAccessToken({ unProtectedCall, formData }) {
    try {
      const tokens = await unProtectedCall("api/auth/login", formData, "post");

      const userEmail = tokens.data.userInfo.userEmail; // Adjust this path based on your actual response structure

      return { tokens, userEmail };
    } catch (error) {
      // return "log", error

      throw error.response.data.message;
    }
  }
);

const initialState = {
  loggedUser: { role: "", id: null },
  accessToken: null,
  refreshToken: null,
  success: false,
  status: "idle", // Could be 'idle', 'loading', 'succeeded', 'failed'
  error: null,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    addLogindetails(state, action) {
      state.loggedUser = action.payload;
    },
    deleteDetails(state) {
      state.loggedUser = {};
      state.success = false;
    },
    updateTokens(state, action) {
      state.accessToken = action.payload.data.accessToken;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(generateAccessToken.fulfilled, (state, action) => {
      state.accessToken = action.payload.tokens.data.accessToken;
      state.refreshToken = action.payload.tokens.data.refreshToken;
      state.success = action.payload.tokens.success;
      state.loggedUser.role = action.payload.tokens.data.userInfo.roleName;
      state.loggedUser.id = action.payload.tokens.data.userInfo.roleId;
      state.loggedUser.email = action.payload.tokens.data.userInfo.userEmail;
      state.loggedUser.employeeId =
        action.payload.tokens.data.userInfo.employeeId;
      state.loggedUser.empId = action.payload.tokens.data.userInfo.empId;
      state.loggedUser.userName = action.payload.tokens.data.userInfo.userName;
      state.loggedUser.img = action.payload.tokens.data.userImg.img;
      state.status = "idle";
    });
    builder.addCase(generateAccessToken.pending, (state) => {
      // alert("hi");

      state.status = "loading";
    });
    builder.addCase(generateAccessToken.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error;
      // alert(JSON.stringify(action.error));
    });
  },
});

// Selectors

export const selectLoginStatus = (state) => state.login.status;
export const selectLoginError = (state) => state.login.error;

export const { addLogindetails, deleteDetails, updateTokens } =
  loginSlice.actions;
export const selectUserData = (state) => state.login.userData;
export const selectLoggedUser = (state) => state.login.loggedUser;

export default loginSlice.reducer;
