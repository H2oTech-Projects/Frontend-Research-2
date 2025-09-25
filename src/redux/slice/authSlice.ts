import { createSlice } from "@reduxjs/toolkit";

// Retrieve the initial login state from session storage
const initialAuthData = JSON.parse(localStorage.getItem("auth") || "null");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: !!initialAuthData,
    user: initialAuthData?.user_details?.user || null,
    access: initialAuthData?.access_token || null,
    refresh: initialAuthData?.refresh_token || null,
    clientId:initialAuthData?.user_details?.client_id || null,
    unitSystemName: initialAuthData?.user_details?.unit_system_name || null,
    landingPageRoute:initialAuthData?.user_details?.redirect_url || null,
    userRole:initialAuthData?.user_details?.client_role,
    viewBound:initialAuthData?.user_details?.view_bound
  },
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload.user_details.user;
      state.access = action.payload.access_token;
      state.refresh = action.payload.refresh_token;
      state.clientId = action.payload?.user_details.client_id;
      state.unitSystemName = action.payload.user_details.unit_system_name;
      state.userRole = action.payload.user_details.client_role;
      state.viewBound = action.payload.user_details.view_bound;
      localStorage.setItem("auth", JSON.stringify(action.payload));
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      state.access = null;
      state.refresh = null;
      state.unitSystemName = null;
      state.userRole= null;
      state.viewBound = null;
      state.landingPageRoute = null;
      localStorage.removeItem("auth");
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
