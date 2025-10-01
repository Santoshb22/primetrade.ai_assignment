import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {     
    authStatus: false,  
    userInfo: null,
  },    
    reducers: {
        setUser: (state, action) => {
            state.userInfo = action.payload.userInfo;
        },
        clearUser: (state) => {
            state.userInfo = null;
        },
        toggleAuth: (state, action) => {
            state.authStatus = action.payload;
        }       
    },
}); 

export const { setUser, clearUser, toggleAuth } = userSlice.actions;
export default userSlice.reducer;