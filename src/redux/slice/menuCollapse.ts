import { createSlice } from "@reduxjs/toolkit";

const collapseSlice = createSlice({
    name: "sideMenuCollapse",
    initialState: {
      sideMenuCollapse: false,
    },
    reducers: {
        setSideMenuCollapse(state,action: {payload: boolean}) {
            state.sideMenuCollapse = action.payload;
        },
    },
});

export const { setSideMenuCollapse } = collapseSlice.actions;
export default collapseSlice.reducer;