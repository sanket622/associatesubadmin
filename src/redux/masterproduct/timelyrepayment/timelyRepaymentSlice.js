// src/redux/slices/timelyRepaymentSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const initialState = {
    loading: false,
    error: null,
    data: null,
    editTimelyRepaaymentData: null,
};

const slice = createSlice({
    name: 'timelyRepayment',
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
        setEditTimelyRepaaymentData(state, action) {
            state.editTimelyRepaaymentData = action.payload;
        },
    },
});

export const {
    submitStart,
    submitSuccess,
    submitFailure,
} = slice.actions;

export const submitTimelyRepayment = (formData, callback) => async dispatch => {
    dispatch(submitStart());
    try {
        const accessToken = localStorage.getItem('accessToken');
        const masterProductId = localStorage.getItem('createdProductId');
        const payload = {
            masterProductId,
            penalInterestApplicable: formData.penalInterestApplicable === 'yes',
        };

        if (formData.penalInterestApplicable === 'yes') {
            payload.incentiveType = formData.incentiveType?.id || null;
            payload.incentiveValue = Number(formData.incentiveValue);
            payload.payoutMode = formData.payoutMode?.id || null;
            payload.incentiveReversalConditions = formData.incentiveReversalConditions;
        }

        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/associate/masterProduct/createMasterProductRepayment`,
            payload,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );

        enqueueSnackbar('Timely repayment saved!', { variant: 'success' });
        dispatch(submitSuccess(response.data));
        callback?.();
    } catch (err) {
        const msg = err.response?.data?.message || 'Submit failed';
        enqueueSnackbar(msg, { variant: 'error' });
        dispatch(submitFailure(msg));
    }
};

export default slice.reducer;
