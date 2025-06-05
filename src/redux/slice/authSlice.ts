import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const savedUser = JSON.parse(localStorage.getItem("user") || "null");
const access = Cookies.get("access_token") || null;
const refresh = Cookies.get("refresh_token") || null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: !!access,
    user: savedUser,
    access,
    refresh,
  },
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.access = action.payload.access_token;
      state.refresh = action.payload.refresh_token;

      // Save tokens to cookies
      Cookies.set("access_token", action.payload.access_token, { secure: true });
      Cookies.set("refresh_token", action.payload.refresh_token, { secure: true });

      // Save user info to localStorage
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      state.access = null;
      state.refresh = null;

      // Remove tokens from cookies
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");

      // Remove user info from localStorage
      localStorage.removeItem("user");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;