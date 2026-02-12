import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const initialState = {
    loading: false,
    error: null,
    data: null,
};

const editMasterProductSubmitSlice = createSlice({
    name: 'collateralSubmit',
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
    clearState,

} = editMasterProductSubmitSlice.actions;

export const submitEditMasterProductSubmit = (payload, callback) => async (dispatch) => {
    dispatch(submitStart());

    try {
        const accessToken = localStorage.getItem('accessToken');
        // const productId = localStorage.getItem('createdProductId');

        const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/associate/masterProductUpdateRequest/submitMasterProductUpdateRequest`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        enqueueSnackbar(response?.data?.message, { variant: 'success' });
        dispatch(submitSuccess(response.data));

        if (typeof callback === 'function') callback();
    } catch (error) {
        console.error(error);
        const message = error.response?.data?.message || 'Failed to edit';
        enqueueSnackbar(message, { variant: 'error' });
        dispatch(submitFailure(message));
    }
};

export default editMasterProductSubmitSlice.reducer;
