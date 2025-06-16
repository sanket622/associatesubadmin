// src/redux/slices/behavioralDataSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const initialState = {
    loading: false,
    error: null,
    data: null,
    editBehavioralData: null
};

const behavioralDataSlice = createSlice({
    name: 'behavioralData',
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
        clearState(state) {
            state.loading = false;
            state.error = null;
            state.data = null;
        },
        setEditBehavioralData(state, action) {
            state.editBehavioralData = action.payload
        }
    },
});

export const {
    submitStart,
    submitSuccess,
    submitFailure,
    clearState,
    setEditBehavioralData,
} = behavioralDataSlice.actions;

export const submitBehavioralData = (formData, callback) => async (dispatch) => {
    dispatch(submitStart());

    try {
        const accessToken = localStorage.getItem('accessToken');
        const masterProductId = localStorage.getItem('createdProductId');

        const payload = {
            masterProductId: masterProductId,
            salaryRegularityThreshold: Number(formData.latePaymentFeeValue),
            spendingConsistencyPercent: Number(formData.prepaymentFeeType),
            upiSpendToIncomeRatio: Number(formData.overallGst),
            billPaymentHistory: formData.disbursementMode?.id,
            digitalFootprintRequired: formData.pdfParsingOrJsonRequired === 'yes',
            locationConsistencyKm: Number(formData.repaymentMode),
            repeatBorrowerBehavior: formData.emiFrequency?.id,
        };

        // Clean up payload
        Object.keys(payload).forEach((key) => {
            if (payload[key] === undefined || Number.isNaN(payload[key])) {
                delete payload[key];
            }
        });

        const response = await axios.post(
            'https://api.earnplus.net/api/v1/associate/masterProduct/createBehavioralData',
            payload,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );

        enqueueSnackbar('Behavioral data submitted successfully!', { variant: 'success' });
        dispatch(submitSuccess(response.data));

        if (typeof callback === 'function') callback();

    } catch (error) {
        console.error(error);
        const message = error.response?.data?.message || 'Failed to submit behavioral data';
        enqueueSnackbar(message, { variant: 'error' });
        dispatch(submitFailure(message));
    }
};

export default behavioralDataSlice.reducer;
