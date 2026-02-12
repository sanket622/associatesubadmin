// src/store/riskSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    internalScores: [],
    externalScores: [],
    loading: false,
    error: null,
};

const riskSlice = createSlice({
    name: 'risk',
    initialState,
    reducers: {
        setInternalScores: (state, action) => {
            state.internalScores = action.payload;
        },
        setExternalScores: (state, action) => {
            state.externalScores = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const {
    setInternalScores,
    setExternalScores,
    setLoading,
    setError,
} = riskSlice.actions;

export const fetchScores = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const [internalRes, externalRes] = await Promise.all([
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/associate/scoreVariable/getAllScoreVariables`),
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/associate/externalScore/getAllExternalScores`),
        ]);

        dispatch(setInternalScores(internalRes.data.data));
        dispatch(setExternalScores(externalRes.data.data));
    } catch (error) {
        dispatch(setError(error.message));
    } finally {
        dispatch(setLoading(false));
    }
};

export default riskSlice.reducer;
