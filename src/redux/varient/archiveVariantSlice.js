// store/slices/archiveVariantSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    submittingArchive: false,
    archiveSuccess: null,
    archiveError: null,
};

const archiveVariantSlice = createSlice({
    name: 'archiveVariant',
    initialState,
    reducers: {
        archiveStart: (state) => {
            state.submittingArchive = true;
            state.archiveError = null;
        },
        archiveSuccess: (state, action) => {
            state.submittingArchive = false;
            state.archiveSuccess = action.payload;
        },
        archiveFailure: (state, action) => {
            state.submittingArchive = false;
            state.archiveError = action.payload;
        },
        clearArchiveStatus: (state) => {
            state.archiveSuccess = null;
            state.archiveError = null;
        },
    },
});

export const {
    archiveStart,
    archiveSuccess,
    archiveFailure,
    clearArchiveStatus,
} = archiveVariantSlice.actions;

export const submitArchive = ({ variantId, reason, reset }, { enqueueSnackbar, onClose }) =>
    async (dispatch) => {
        dispatch(archiveStart());
        try {
            const token = localStorage.getItem('accessToken');

            const payload = {
                variantProductId: variantId,
                reason: reason,
            };


            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/associate/variantProduct/createVariantProductDeleteRequest`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            dispatch(archiveSuccess(response.data));
            enqueueSnackbar('Archived successfully', { variant: 'success' });

            if (typeof reset === 'function') reset();
            if (typeof onClose === 'function') onClose();
        } catch (err) {
            dispatch(archiveFailure(err.message));
            enqueueSnackbar(`Archive failed: ${err.message}`, { variant: 'error' });
        }
    };


export default archiveVariantSlice.reducer;
