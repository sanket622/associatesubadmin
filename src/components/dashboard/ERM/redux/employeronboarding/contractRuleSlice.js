// contractRuleSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const initialState = {
    workLocations: [],
    loading: false,
    error: null,
};

const contractRuleSlice = createSlice({
    name: 'contractRule',
    initialState,
    reducers: {
        fetchWorkLocationsSuccess(state, action) {
            state.workLocations = action.payload;
        },
        setRuleLoading(state, action) {
            state.loading = action.payload;
        },
        setRuleError(state, action) {
            state.error = action.payload;
        },
    },
});

export const {
    fetchWorkLocationsSuccess,
    setRuleLoading,
    setRuleError,
} = contractRuleSlice.actions;

export const fetchWorkLocations = (employerId) => async (dispatch) => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(
            `https://api.earnplus.net/api/v1/associate/contractCombination/getWorkLocationsByEmployerId?employerId=${employerId}`,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );

        const options = response.data.data.map(item => ({
            label: item.workspaceName,
            value: item.id,
        }));


        dispatch(fetchWorkLocationsSuccess(options));
    } catch (error) {
        enqueueSnackbar('Failed to fetch work locations', { variant: 'error' });
    }
};


export const submitRuleBook = (payload, callback) => async (dispatch) => {
    dispatch(setRuleLoading(true));
    try {
        const accessToken = localStorage.getItem('accessToken');
        await axios.post(
            'https://api.earnplus.net/api/v1/associate/contractCombination/createContractRuleBook',
            payload,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );

        enqueueSnackbar('Rule added successfully!', { variant: 'success' });
        if (callback) callback();
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to submit rule';
        enqueueSnackbar(message, { variant: 'error' });
        dispatch(setRuleError(message));
    } finally {
        dispatch(setRuleLoading(false));
    }
};

export default contractRuleSlice.reducer;
