import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authSlice";
import  sideMenuCollapseReducer  from "../slice/menuCollapse";

const store = configureStore({
    reducer: {
        auth: authReducer,
        sideMenuCollapse:sideMenuCollapseReducer,
    },
});

export default store;
