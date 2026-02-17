import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const initialState = {
  loading: false,
  error: null,
  data: null,
  editVarientOtherChargesData: null
};

const variantProductOtherChargesSubmitSlice = createSlice({
  name: 'variantProductOtherChargesSubmit',
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
    clearSubmitState(state) {
      state.loading = false;
      state.error = null;
      state.data = null;
    },
    seteditVarientOtherChargesData(state, action) {
      state.editVarientOtherChargesData = action.payload
    },
  },
});

export const {
  submitStart,
  submitSuccess,
  submitFailure,
  clearSubmitState,
  seteditVarientOtherChargesData,
} = variantProductOtherChargesSubmitSlice.actions;

// 🔁 Thunk to submit other charges
export const submitVariantOtherCharges = (formData, callback) => async (dispatch) => {
  dispatch(submitStart());

  try {
    const accessToken = localStorage.getItem('accessToken');
    const variantId = localStorage.getItem('createdVariantId');

    const payload = {
      variantProductId: variantId,
      bounceCharge: Number(formData.chequeBounceCharges),
      furnishingCharge: Number(formData.statementCharges),
      revocation: Number(formData.ecsCharges),
      documentCharge: Number(formData.documentCopyCharges),
      stampDutyCharge: Number(formData.stampDutyCharges),
      nocCharge: Number(formData.nocIssuanceCharges),
      incidentalCharge: Number(formData.legalCharges),
    };

    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/associate/variantProduct/createVariantProductOtherCharges`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    enqueueSnackbar('Other Charges submitted successfully!', { variant: 'success' });
    dispatch(submitSuccess(response.data));

    if (typeof callback === 'function') callback();
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to submit other charges';
    enqueueSnackbar(message, { variant: 'error' });
    dispatch(submitFailure(message));
  }
};

export default variantProductOtherChargesSubmitSlice.reducer;
