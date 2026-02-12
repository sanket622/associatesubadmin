import { createSlice } from '@reduxjs/toolkit';
import { enqueueSnackbar } from 'notistack';
import axios from 'axios';

const initialState = {
    loading: false,
    error: null,
};

const creditCriteriaSlice = createSlice({
    name: 'creditCriteria',
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
    },
});

export const {
    submitStart,
    submitSuccess,
    submitFailure,
    clearState
} = creditCriteriaSlice.actions;

export default creditCriteriaSlice.reducer;

/* ===================== THUNK ===================== */

export const submitCreditCriteria =
    (payload) =>
        async (dispatch) => {
            dispatch(submitStart());

            try {
                const accessToken = localStorage.getItem('accessToken');

                const response = await axios.post(
                    `${process.env.REACT_APP_BACKEND_URL}/associate/masterProduct/createProductCreditAssignmentRule`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                enqueueSnackbar('Credit Criteria data submitted successfully!', { variant: 'success' });
                dispatch(submitSuccess(response.data));
                return response.data;
            } catch (error) {
                const message =
                    error?.response?.data?.message ||
                    'Failed to submit credit criteria';

                enqueueSnackbar(message, { variant: 'error' });
                dispatch(submitFailure(message));
                throw error;
            }
        };
