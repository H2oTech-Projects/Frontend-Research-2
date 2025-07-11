import { createSlice } from "@reduxjs/toolkit";

// Retrieve the initial login state from session storage
const initialAuthData = JSON.parse(localStorage.getItem("auth") || "null");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: !!initialAuthData,
    user: initialAuthData?.user || null,
    access: initialAuthData?.access || null,
    refresh: initialAuthData?.refresh || null,
    clientId:initialAuthData?.client_id || null,
  },
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.access = action.payload.access;
      state.refresh = action.payload.refresh;
      state.clientId = action.payload.client_id;
      localStorage.setItem("auth", JSON.stringify(action.payload));
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      state.access = null;
      state.refresh = null;
      localStorage.removeItem("auth");
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
