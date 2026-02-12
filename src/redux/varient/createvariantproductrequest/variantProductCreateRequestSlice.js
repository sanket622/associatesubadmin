// redux/variant/variantProductCreateRequestSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const initialState = {
    loading: false,
    error: null,
    success: false,
};

const variantProductCreateRequestSlice = createSlice({
    name: 'variantProductCreateRequest',
    initialState,
    reducers: {
        requestStart: (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        },
        requestSuccess: (state) => {
            state.loading = false;
            state.success = true;
        },
        requestFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        resetRequestState: () => initialState,
    },
});

export const {
    requestStart,
    requestSuccess,
    requestFailure,
    resetRequestState,
} = variantProductCreateRequestSlice.actions;

export const submitVariantProductForApproval =
    (variantProductId) => async (dispatch) => {
        dispatch(requestStart());

        try {
            const accessToken = localStorage.getItem('accessToken');

            // console.log(variantProductId);
            
           const res =  await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/associate/variantProductCreateRequest/submitVariantProductForApproval`,
                { variantProductId },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            enqueueSnackbar(res?.data?.message || 'Variant submitted for approval!', {
                variant: 'success',
            });

            dispatch(requestSuccess());
        } catch (error) {
            const message =
                error.response?.data?.message ||
                'Failed to submit variant for approval';

            enqueueSnackbar(message, { variant: 'error' });
            dispatch(requestFailure(message));
        }
    };

export default variantProductCreateRequestSlice.reducer;