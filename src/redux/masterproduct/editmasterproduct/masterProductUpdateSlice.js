import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    generalMetadata: {},
    financialTermsUpdate: {},
    eligibilityCriteriaUpdate: {},
    creditCriteria: {},
    creditBureauConfigUpdate: {},
    otherChargesUpdate: {},
};

const masterProductUpdateSlice = createSlice({
    name: 'masterProductUpdate',
    initialState,
    reducers: {
        setGeneralMetadata: (state, action) => {
            state.generalMetadata = action.payload;
        },
        setProductParameters: (state, action) => {
            state.financialTermsUpdate = action.payload;
        },
        setOtherCharges: (state, action) => {
            state.otherChargesUpdate = action.payload;
        },
        setEligibilityCriteria: (state, action) => {
            state.eligibilityCriteriaUpdate = action.payload;
        },

        setCreditBureauParameters: (state, action) => {
            state.creditBureauConfigUpdate = action.payload;
        },

        setCreditCriteria: (state, action) => {
            state.creditCriteria = action.payload;
        },


        resetMasterProductUpdate: () => initialState,
    },
});

export const {
    setGeneralMetadata,
    setProductParameters,
    setEligibilityCriteria,
    setCreditCriteria,
    setCreditBureauParameters,
    setOtherCharges,
    resetMasterProductUpdate,
} = masterProductUpdateSlice.actions;

export default masterProductUpdateSlice.reducer;
