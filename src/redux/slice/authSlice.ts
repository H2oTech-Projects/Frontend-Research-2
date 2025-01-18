import { createSlice } from "@reduxjs/toolkit";

// Retrieve the initial login state from session storage
const initialLoginState = JSON.parse(sessionStorage.getItem("isLoggedIn") as string) || false;

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: initialLoginState,
    },
    reducers: {
        login(state) {
            state.isLoggedIn = true;
            sessionStorage.setItem("isLoggedIn", JSON.stringify(true));
        },
        logout(state) {
            state.isLoggedIn = false;
            sessionStorage.setItem("isLoggedIn", JSON.stringify(false));
        },
    },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
