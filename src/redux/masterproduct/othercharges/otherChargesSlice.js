// src/redux/slices/otherChargesSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const initialState = {
  loading: false,
  error: null,
  data: null,
  editOtherChargesData: null,
};

const otherChargesSlice = createSlice({
  name: 'otherCharges',
  initialState,
  reducers: {
    submitStart(state) {
      state.loading = true;
      state.error = null;
    },
    submitSuccess(state, action) {
      state.loading = false;
      state.data = action.payload;
    },
    submitFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearOtherChargesState(state) {
      state.loading = false;
      state.error = null;
      state.data = null;
    },
    setEditOtherChargesData(state, action) {
      state.editOtherChargesData = action.payload;
    },
  },
});

export const {
  submitStart,
  submitSuccess,
  submitFailure,
  clearOtherChargesState,
  setEditOtherChargesData,
} = otherChargesSlice.actions;

// Thunk-like action to submit Other Charges
export const submitOtherCharges = (formData, callback) => async (dispatch) => {
  dispatch(submitStart());

  try {
    const accessToken = localStorage.getItem('accessToken');
    const masterProductId = localStorage.getItem('createdProductId');

    const payload = {
      masterProductId,
      bounceCharge: Number(formData.bounceCharge),
      furnishingCharge: Number(formData.furnishingCharge),
      revocation: Number(formData.revocation),
      documentCharge: Number(formData.documentCharge),
      stampDutyCharge: Number(formData.stampDutyCharge),
      nocCharge: Number(formData.nocCharge),
      incidentalCharge: Number(formData.incidentalCharge),
    };

    // Remove invalid or undefined keys
    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined || Number.isNaN(payload[key])) {
        delete payload[key];
      }
    });

    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/associate/masterProduct/createMasterProductOtherCharges`,
      payload,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    enqueueSnackbar('Other charges submitted successfully!', { variant: 'success' });
    dispatch(submitSuccess(response.data));

    if (typeof callback === 'function') callback();
  } catch (error) {
    console.error(error);
    const message = error.response?.data?.message || 'Failed to submit other charges';
    enqueueSnackbar(message, { variant: 'error' });
    dispatch(submitFailure(message));
  }
};

export default otherChargesSlice.reducer;
