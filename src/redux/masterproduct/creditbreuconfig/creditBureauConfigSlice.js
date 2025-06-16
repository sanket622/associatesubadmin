import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const initialState = {
    loading: false,
    error: null,
    data: null,
    editCreditBureauData: null
};

const creditBureauConfigSlice = createSlice({
    name: 'creditBureauConfig',
    initialState,
    reducers: {
        submitStart(state) {
            state.loading = true;
            state.error = null;
        },
        submitSuccess(state, action) {
            state.loading = false;
            state.data = action.payload;
            state.error = null;
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
        setEditCreditBureauData(state, action) {
            state.editCreditBureauData = action.payload
        }
    },
});

export const { submitStart, submitSuccess, submitFailure, clearState, setEditCreditBureauData } = creditBureauConfigSlice.actions;

export default creditBureauConfigSlice.reducer;

// Manual async thunk
export const submitCreditBureauConfig = (formData, callback) => async (dispatch) => {
    dispatch(submitStart());

    try {
        const accessToken = localStorage.getItem('accessToken');
        const productId = localStorage.getItem('createdProductId');
        const payload = {
            masterProductId: productId,

            creditBureauSources: Array.isArray(formData.creditBureauSource)
                ? formData.creditBureauSource.map(item => item.id || item)
                : [formData.creditBureauSource?.id || formData.creditBureauSource],

            minScoreRequired: Number(formData.minScoreRequired),
            maxActiveLoans: Number(formData.maxActiveLoans),
            maxCreditUtilization: Number(formData.maxCreditUtilRatio),
            enquiriesLast6Months: Number(formData.enquiriesLast6Months),
            loanDelinquencyAllowed: formData.loanDelinquencyAllowed?.id || formData.loanDelinquencyAllowed,
            bureauDataFreshnessDays: Number(formData.bureauFreshnessDays),

            customBureauFlags: Array.isArray(formData.customBureauFlags)
                ? formData.customBureauFlags.map(flag => flag.id || flag)
                : [formData.customBureauFlags?.id || formData.customBureauFlags],

            scoreDecayTolerance: Number(formData.scoreDecayTolerance),
        };


        // Remove undefined or NaN
        Object.keys(payload).forEach(key => {
            if (payload[key] === undefined || Number.isNaN(payload[key])) {
                delete payload[key];
            }
        });

        const response = await axios.post(
            'https://api.earnplus.net/api/v1/associate/masterProduct/createCreditBureauConfig',
            payload,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );

        enqueueSnackbar('Credit Bureau config submitted successfully!', { variant: 'success' });

        dispatch(submitSuccess(response.data));
        if (callback && typeof callback === 'function') callback();

    } catch (error) {
        console.log(error);

        const message = error.response?.data?.message || 'Failed to submit credit bureau config';
        enqueueSnackbar(message, { variant: 'error' });
        dispatch(submitFailure(message));
    }
};
