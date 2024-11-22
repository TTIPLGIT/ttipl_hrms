import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userMockData } from "../../utils/mockData";

export const generateAccessToken = createAsyncThunk(
  "user/generateAccessToken",
  async function generateAccessToken(unProtectedCall) {
    const tokens = await unProtectedCall(
      "/auth/login",
      {
        email: "john@mail.com",
        password: "changeme",
      },
      "post"
    );

    return { tokens };
  }
);

export const userDataFetch = createAsyncThunk(
  "user/userDataFetch",
  async function userDataFetch({ protectedCall, useMock }) {
    const userData = useMock
      ? await userMockData
      : await protectedCall("/auth/profile");
    return { userData };
  }
);

const initialState = {
  userData: [],
  accessToken: null,
  refreshToken: null,
  status: "idle",
  error: null,
};
const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    updateTokens(state, action) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    addUser(state, action) {
      state.userData.push({
        ...action.payload,
        id: state?.userData?.length + 1,
      });
    },
    updateUser(state, action) {
      let userIndex = state.userData.findIndex(
        (elem) => elem.id === action?.payload?.id
      );
      state.userData[userIndex] = action.payload;
    },
    deleteUser(state, action) {
      state.userData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(generateAccessToken.fulfilled, (state, action) => {
      state.accessToken = action.payload.tokens.access_token;
      state.refreshToken = action.payload.tokens.refresh_token;
      state.status = "idle";
    });
    builder.addCase(generateAccessToken.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(generateAccessToken.rejected, (state, action) => {
      state.error = action.error;
      state.status = "idle";
    });
    builder.addCase(userDataFetch.fulfilled, (state, action) => {
      state.userData = [action.payload.userData];
      state.status = "idle";
    });
    builder.addCase(userDataFetch.pending, (state) => {
      state.status = "loading";
    });
  },
});

export default userSlice.reducer;

export const { setLoader, addUser, updateTokens, updateUser, deleteUser } =
  userSlice.actions;
