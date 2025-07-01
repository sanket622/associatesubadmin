import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  userModules: [],  
  allModules: [],  
  filteredModules: [], 
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.userModules = user.modules || [];
    },
    setAllModules: (state, action) => {
      state.allModules = action.payload;
    },
    setFilteredModules: (state, action) => {
      state.filteredModules = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.userModules = [];
      state.allModules = [];
      state.filteredModules = [];
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

export const {
  setCredentials,
  setAllModules,
  setFilteredModules,
  logout,
  setLoading,
  setError,
} = authSlice.actions;

// Login thunk
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

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userId', user.id);

    // After login, fetch all modules
    dispatch(fetchAllModules());

    return { success: true };
  } catch (error) {
    const errMsg = error?.response?.data?.message || 'Login failed';
    dispatch(setError(errMsg));
    return { success: false, message: errMsg };
  } finally {
    dispatch(setLoading(false));
  }
};

// Fetch all modules thunk
export const fetchAllModules = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const response = await axios.get('https://api.earnplus.net/api/v1/associate/roleModule/getAllModules');

    const allModules = response.data.data || [];
    dispatch(setAllModules(allModules));

    // Get user modules from state
    const userModules = getState().auth.userModules || [];

    // Match user modules with all modules by path (or id)
    const filteredModules = allModules.filter((mod) =>
      userModules.some((userMod) => userMod.path === mod.path)
    );

    dispatch(setFilteredModules(filteredModules));
  } catch (error) {
    const errMsg = error?.response?.data?.message || 'Failed to fetch modules';
    dispatch(setError(errMsg));
  } finally {
    dispatch(setLoading(false));
  }
};

export default authSlice.reducer;
