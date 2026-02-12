
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const initialState = {
  loading: false,
  error: null,
  categories: [],
  fields: [],
};

const productFieldsSlice = createSlice({
  name: 'productFields',
  initialState,
  reducers: {
    requestStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    requestSuccess: (state) => {
      state.loading = false;
    },
    requestFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setFields: (state, action) => {
      state.fields = action.payload;
    },
  },
});

export const {
  requestStart,
  requestSuccess,
  requestFailure,
  setCategories,
  setFields,
} = productFieldsSlice.actions;

/* ------------------ THUNK ------------------ */
//for fields creation
export const createMasterProductFields = (data) => async (dispatch) => {
  dispatch(requestStart());
  try {
    const accessToken = localStorage.getItem('accessToken');
    const masterProductId = localStorage.getItem('createdProductId');

    const payload = {
      masterProductId,
      fieldsJsonData: JSON.stringify(data),
    };

    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/associate/masterProduct/createMasterProductFields`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    enqueueSnackbar(res?.data?.message, { variant: 'success' });
    dispatch(requestSuccess());
  } catch (err) {
    dispatch(requestFailure(err?.response?.data?.message));
    enqueueSnackbar(err?.response?.data?.message, { variant: 'error' });
  }
};

export default productFieldsSlice.reducer;
