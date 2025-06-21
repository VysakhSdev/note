// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice'; // Make sure this path is correct
const store = configureStore({
  reducer: {
    auth: authReducer, // Ensure that auth is added to the store\
  },
});

export default store;
