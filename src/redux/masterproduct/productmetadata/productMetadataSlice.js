import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  productCategories: [],
  productSegments: [],
  loanTypes: [],
  purposeCategories: [],
  partners: [],
  geographyStates: [],
  loading: false,
  error: null
};

const productMetadataSlice = createSlice({
  name: 'productMetadata',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setProductCategories: (state, action) => {
      state.productCategories = action.payload;
    },
    setProductSegments: (state, action) => {
      state.productSegments = action.payload;
    },
    setLoanTypes: (state, action) => {
      state.loanTypes = action.payload;
    },
    setPurposeCategories: (state, action) => {
      state.purposeCategories = action.payload;
    },
    setPartners: (state, action) => {
      state.partners = action.payload;
    },
    setGeographyStates: (state, action) => {
      state.geographyStates = action.payload;
    }
  }
});

export const {
  setLoading,
  setError,
  setProductCategories,
  setProductSegments,
  setLoanTypes,
  setPurposeCategories,
  setPartners,
  setGeographyStates
} = productMetadataSlice.actions;

export const fetchProductMetadata = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const [
      productCategoriesRes,
      segmentsRes,
      loansRes,
      purposesRes,
      partnersRes,
      geographyRes
    ] = await Promise.all([
      axios.get('https://api.earnplus.net/api/v1/associate/productCategory/getAllProductCategories'),
      axios.get('https://api.earnplus.net/api/v1/associate/segment/getAllProductSegments'),
      axios.get('https://api.earnplus.net/api/v1/associate/loan/getAllLoanTypes'),
      axios.get('https://api.earnplus.net/api/v1/associate/productCategory/getProductPurposes'),
      axios.get('https://api.earnplus.net/api/v1/associate/partner/getAllProductPartners'),
      axios.get('https://api.earnplus.net/api/v1/associate/location/getStatesByCountry/ad445591-3574-4a07-9b81-09ffedcc1bb6')
    ]);

    dispatch(setProductCategories(productCategoriesRes.data.data));
    dispatch(setProductSegments(segmentsRes.data.data));
    dispatch(setLoanTypes(loansRes.data.data));
    dispatch(setPurposeCategories(purposesRes.data.data));
    dispatch(setPartners(partnersRes.data.data));
    dispatch(setGeographyStates(geographyRes.data.data));

  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export default productMetadataSlice.reducer;
