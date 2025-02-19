import { createSlice } from '@reduxjs/toolkit';

// Initial state, checking localStorage for persisted token
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null, // Retrieve user data from localStorage if it exists
  token: localStorage.getItem("token") || null, // Retrieve token from localStorage if it exists
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;

      // Save the user and token to localStorage for persistence
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;

      // Remove the user and token from localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }
});

export const { setLogin, setLogout } = userSlice.actions;

export default userSlice.reducer;
