import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const initialState = {
  loading: false,
  error: null,
  success: false,
  repaymentModes: [],   
  disbursementModes: [],
  editProductparameter: null
};

const financialTermsSlice = createSlice({
  name: 'financialTerms',
  initialState,
  reducers: {
    submitStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    submitSuccess: (state) => {
      state.loading = false;
      state.success = true;
    },
    submitFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    resetStatus: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    setProductCategories: (state, action) => {
      state.productCategories = action.payload;
    },
    setProductSegments: (state, action) => {
      state.productSegments = action.payload;
    },
    setRepaymentModes: (state, action) => {
      state.repaymentModes = action.payload;
    },
    setDisbursementModes: (state, action) => {
      state.disbursementModes = action.payload;
    },
    setEditProductparameter: (state, action) => {
      state.editProductparameter = action.payload;
    },
  },
});

export const {
  submitStart,
  submitSuccess,
  submitFailure,
  resetStatus,
  setProductCategories,
  setProductSegments,
  setRepaymentModes,
  setDisbursementModes,
  setEditProductparameter,
} = financialTermsSlice.actions;

// Submit financial terms thunk (manual)
export const submitFinancialTerms = (formData,  callback) => async (dispatch) => {
  dispatch(submitStart());
  try {
    const accessToken = localStorage.getItem('accessToken');

    const productId = localStorage.getItem('createdProductId');

    const payload = {
      masterProductId: productId,
      minLoanAmount: Number(formData.minLoanAmount),
      maxLoanAmount: Number(formData.maxLoanAmount),
      minTenureMonths: Number(formData.minTenureMonths),
      maxTenureMonths: Number(formData.maxTenureMonths),
      interestRateType: formData.interestRateType?.id,
      interestRateMin: Number(formData.interestMin),
      interestRateMax: Number(formData.interestMax),
      processingFeeType: formData.processingFeeType?.id,
      processingFeeValue: Number(formData.processingFeeValue),
      latePaymentFeeType: formData.latePaymentFeeType?.id,
      latePaymentFeeValue: Number(formData.latePaymentFeeValue),
      prepaymentAllowed: formData.prepaymentRulesAllowed === 'yes',
      prepaymentFeeType: formData.prepaymentFeeType?.id,
      prepaymentFeeValue: Number(formData.prepaymentFeeValue),
      emiFrequency: formData.emiFrequency?.id,
      disbursementModeIds: formData.disbursementMode ? [formData.disbursementMode.id] : [],
      repaymentModeIds: formData.repaymentMode ? [formData.repaymentMode.id] : [],
    };

    // Remove keys with undefined or NaN values
    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined || Number.isNaN(payload[key])) {
        delete payload[key];
      }
    });

    const response = await axios.post(
      'https://api.earnplus.net/api/v1/associate/masterProduct/createFinancialTerms',
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    enqueueSnackbar('Financial terms submitted successfully!', { variant: 'success' });

    dispatch(submitSuccess());
     if(callback && typeof callback === "function"){
      callback()
    }
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to submit financial terms';

    enqueueSnackbar(message, { variant: 'error' });
    dispatch(submitFailure(message));
    return { success: false, message };
  }
};

export const fetchRepaymentModes = () => async (dispatch) => {
  try {
    const response = await axios.get('/api/v1/associate/repayment/getAllRepaymentModes');
    dispatch(setRepaymentModes(response.data.data));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch repayment modes';
    enqueueSnackbar(message, { variant: 'error' });
  }
};

// Manual thunk to fetch disbursement modes
export const fetchDisbursementModes = () => async (dispatch) => {
  try {
    const response = await axios.get('/api/v1/associate/disbursement/getAllDisbursementModes');
    dispatch(setDisbursementModes(response.data.data));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch disbursement modes';
    enqueueSnackbar(message, { variant: 'error' });
  }
};

export default financialTermsSlice.reducer;
