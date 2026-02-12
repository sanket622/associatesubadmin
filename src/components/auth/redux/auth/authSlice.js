import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  userModules: [],
  allModules: [],
  // filteredModules: [],
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
      state.allModules = user.modules || [];
    },
    setAllModules: (state, action) => {
      state.allModules = action.payload;
    },

    // setFilteredModules: (state, action) => {
    //   state.filteredModules = action.payload;
    // },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.userModules = [];
      state.allModules = [];

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('user');
      localStorage.removeItem('modules');
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
  // setFilteredModules,
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
      `${process.env.REACT_APP_BACKEND_URL}/associate/associateSubAdmin/loginAssociateSubAdmin`,
      { email, password }
    );

    const { user, accessToken, refreshToken } = response.data.data;
    console.log(response.data.data);

    dispatch(setCredentials({ user, accessToken, refreshToken }));

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userId', user.id);
    localStorage.setItem('role', user.role);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('modules', JSON.stringify(user.modules || []));


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
// export const fetchAllModules = (id) => async (dispatch, getState) => {
//   try {
//     dispatch(setLoading(true));
//     dispatch(setError(null));

//     const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/associate/roleModule/getModulesByRole/${id}`);

//     // const allModules = response.data.data || [];
//     // dispatch(setAllModules(allModules));

//     const userModules = getState().auth.userModules || [];

//     // const filteredModules = allModules.filter((mod) =>
//     //   userModules.some((userMod) => userMod.path === mod.path)
//     // );

//     // dispatch(setFilteredModules(filteredModules));
//     // Persist filteredModules in localStorage
//     // localStorage.setItem('filteredModules', JSON.stringify(filteredModules));

//   } catch (error) {
//     const errMsg = error?.response?.data?.message || 'Failed to fetch modules';
//     dispatch(setError(errMsg));
//   } finally {
//     dispatch(setLoading(false));
//   }
// };


export default authSlice.reducer;
