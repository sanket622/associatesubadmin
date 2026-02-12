// featuresSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  partners: [],
  contractTypes: [],
  combinations: [],
  ruleBooks: [],
  variants: [],
  loading: false,
  error: null,
};

const featuresSlice = createSlice({
  name: 'features',
  initialState,
  reducers: {
    // Partners
    fetchPartnersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPartnersSuccess: (state, action) => {
      state.loading = false;
      state.partners = action.payload;
    },
    fetchPartnersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Contract Types
    fetchContractTypesSuccess: (state, action) => {
      state.contractTypes = action.payload;
    },

    // Contract Combinations
    fetchContractCombinationsSuccess: (state, action) => {
      state.combinations = action.payload;
    },

    // Rule Books
    fetchRuleBooksSuccess: (state, action) => {
      state.ruleBooks = action.payload;
    },

    // Variants
    fetchAssignedVariantsSuccess: (state, action) => {
      state.variants = action.payload;
    },
  },
});

export const {
  fetchPartnersStart,
  fetchPartnersSuccess,
  fetchPartnersFailure,
  fetchContractTypesSuccess,
  fetchContractCombinationsSuccess,
  fetchRuleBooksSuccess,
  fetchAssignedVariantsSuccess,
} = featuresSlice.actions;

// Thunks

export const fetchPartners = () => async (dispatch) => {
  dispatch(fetchPartnersStart());
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/associate/associateSubAdmin/getEmployersByAssociateSubAdmin`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Map API response to label/value for RHFAutocomplete
    const formatted = response.data.data.map((item) => ({
      label: item.name,
      value: item.id,
    }));

    dispatch(fetchPartnersSuccess(formatted));
  } catch (error) {
    const message =
      error.response?.data?.message || 'Failed to fetch partners';
    dispatch(fetchPartnersFailure(message));
  }
};

export const fetchContractTypes = (employerId) => async (dispatch) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/employer/auth/getEmployerContractTypes?employerId=${employerId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    // Map nested contractType to label/value
    const formatted = response.data.data.map((item) => ({
      label: item.contractType.name,
      value: item.id,
    }));

    dispatch(fetchContractTypesSuccess(formatted));
  } catch (error) {
    console.error('Failed to fetch contract types:', error);
  }
};

export const fetchContractCombinations = (contractTypeId) => async (dispatch) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/associate/contractCombination/getContractCombinationsByContractType/${contractTypeId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    // Use uniqueId as label, id as value
    const formatted = response.data.data.map((item) => ({
      label: item.uniqueId,
      value: item.id,
    }));

    dispatch(fetchContractCombinationsSuccess(formatted));
  } catch (error) {
    console.error('Failed to fetch contract combinations:', error);
  }
};

export const fetchRuleBooks = (comboId) => async (dispatch) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/associate/contractCombination/getContractRuleBooks?contractCombinationId=${comboId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    // Use ruleName as label, id as value
    const formatted = response.data.data.map((item) => ({
      label: item.ruleBookId || item.id,
      value: item.id,
    }));

    dispatch(fetchRuleBooksSuccess(formatted));
  } catch (error) {
    console.error('Failed to fetch rule books:', error);
  }
};

export const fetchAssignedVariants = (employerId) => async (dispatch) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/associate/variantProduct/getAssignedVariantProducts/${employerId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    // Use variantProduct.variantName as label, variantProduct.id as value
    const formatted = response.data.data.map((item) => ({
      label: item.variantProduct.variantName,
      value: item.variantProduct.id,
    }));

    dispatch(fetchAssignedVariantsSuccess(formatted));
  } catch (error) {
    console.error('Failed to fetch assigned variants:', error);
  }
};

export default featuresSlice.reducer;
