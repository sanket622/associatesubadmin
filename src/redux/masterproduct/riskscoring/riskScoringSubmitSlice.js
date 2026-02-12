import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const initialState = {
    loading: false,
    error: null,
    data: null,
    editRiskScoringData: null
};

const riskScoringSubmitSlice = createSlice({
    name: 'riskScoringSubmit',
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
        setEditRiskScoringData(state, action) {
            state.editRiskScoringData = action.payload
        }
    },
});

export const {
    submitStart,
    submitSuccess,
    submitFailure,
    clearState,
    setEditRiskScoringData,
} = riskScoringSubmitSlice.actions;

export const submitRiskScoringData = (formData, callback) => async (dispatch) => {
    dispatch(submitStart());

    try {
        const accessToken = localStorage.getItem('accessToken');
        const masterProductId = localStorage.getItem('createdProductId');

        const payload = {
            masterProductId,
            internalScoreVars: formData.internalScoreVariables ? [formData.internalScoreVariables.id] : [],
            externalScoreInputs: formData.externalScoreInputs ? [formData.externalScoreInputs.id] : [],
            riskCategoryMapping: Number(formData.riskCategoryMapping),
            maxDTI: Number(formData.maxDtiRatioAllowed),
            maxLTV: Number(formData.maxLtvRatioIfSecured),
            coBorrowerRequired: formData.coBorrowerRequiredForLowScore === 'yes'
        };

        const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/associate/masterProduct/createRiskScoring`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        enqueueSnackbar('Risk scoring data submitted successfully!', { variant: 'success' });
        dispatch(submitSuccess(response.data));
        if (typeof callback === 'function') callback();

    } catch (error) {
        console.error(error);
        const message = error.response?.data?.message || 'Failed to submit risk scoring data';
        enqueueSnackbar(message, { variant: 'error' });
        dispatch(submitFailure(message));
    }
};

export default riskScoringSubmitSlice.reducer;
