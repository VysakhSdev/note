import { createSlice } from '@reduxjs/toolkit';

// Utility functions
export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    console.error('Failed to parse JWT:', error);
    return null;
  }
};

const isTokenExpired = (token) => {
  const decodedToken = parseJwt(token);
  if (decodedToken?.exp) {
    const now = Date.now() / 1000; // Current time in seconds
    return decodedToken.exp < now;
  }
  return false; // If no exp field, assume it's valid
};

// Function to check if token is valid
const getValidToken = () => {
  const token = localStorage.getItem('accessToken');
  if (token && !isTokenExpired(token)) {
    console.log("Token is valid: ", token);
    return token;
  }
  console.log("No valid token found.");
  return null;
};

// Initial state
const token = getValidToken();

const initialState = {
  isAuthenticated: !!token,
  accessToken: token,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      const { token, id, userName } = action.payload;
      console.log('Logging in with token:', token,id);

      state.isAuthenticated = true;
      state.accessToken = token;
      localStorage.setItem('accessToken', token);
      localStorage.setItem('userId', id);
      localStorage.setItem('userName', userName);
    },
    doLogout(state) {
      console.log('Logging out, removing token');
      state.isAuthenticated = false;
      state.accessToken = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
    },
  },
});

export const { login, doLogout } = authSlice.actions;

export default authSlice.reducer;
