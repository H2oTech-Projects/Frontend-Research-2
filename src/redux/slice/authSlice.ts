import { createSlice } from "@reduxjs/toolkit";

// Retrieve the initial login state from session storage
const initialAuthData = JSON.parse(localStorage.getItem("auth") || "null");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: !!initialAuthData,
    user: initialAuthData?.user || null,
    access: initialAuthData?.access_token || null,
    refresh: initialAuthData?.refresh_token || null,
    unitSystemName: initialAuthData?.unit_system_name || null
  },
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.access = action.payload.access_token;
      state.refresh = action.payload.refresh_token;
      state.unitSystemName = action.payload.unit_system_name;
      localStorage.setItem("auth", JSON.stringify(action.payload));
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      state.access = null;
      state.refresh = null;
      state.unitSystemName = null;
      localStorage.removeItem("auth");
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
