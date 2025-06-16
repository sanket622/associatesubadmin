import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state
const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// ✅ Manual thunk (async action)
export const loginUser = (email, password) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
  
      const response = await axios.post(
        'https://api.earnplus.net/api/v1/associate/associateSubAdmin/loginAssociateSubAdmin',
        { email, password }
      );
  
      const { user, accessToken, refreshToken } = response.data.data;
  
      dispatch(setCredentials({ user, accessToken, refreshToken }));
  
      // Save to localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userId', user.id);
  
      return { success: true }; // ✅ return success
    } catch (error) {
      const errMsg = error?.response?.data?.message || 'Login failed';
      dispatch(setError(errMsg));
      return { success: false, message: errMsg }; // ✅ return failure
    } finally {
      dispatch(setLoading(false));
    }
  };
  

export const { setCredentials, logout, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
