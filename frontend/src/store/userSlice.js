import { createSlice } from "@reduxjs/toolkit";

const storedUser = JSON.parse(localStorage.getItem("userState"));

const userSlice = createSlice({
  name: "user",
  initialState: storedUser || {     
    authStatus: false,  
    userInfo: null,
    token: null,
  },    
  reducers: {
    toggleAuth: (state, action) => {
      state.authStatus = action.payload;
      localStorage.setItem("userState", JSON.stringify(state));
    },       
    setUser: (state, action) => {
      state.userInfo = action.payload.userInfo;
      state.token = action.payload.token;
      state.authStatus = true;

      localStorage.setItem("userState", JSON.stringify(state));
    },
    clearUser: (state) => {
      state.userInfo = null;
      state.token = null;
      state.authStatus = false;

      localStorage.removeItem("userState");
    },
  },
}); 

export const { setUser, clearUser, toggleAuth } = userSlice.actions;
export default userSlice.reducer;
