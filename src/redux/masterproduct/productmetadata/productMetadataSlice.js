import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  productCategories: [],
  productSegments: [],
  loanTypes: [],
  purposeCategories: [],
  partners: [],
  geographyStates: [],

  deliveryChannels: [],
  disbursementModes: [],
  repaymentModes: [],

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
    },

    setDeliveryChannels: (state, action) => {
      state.deliveryChannels = action.payload;
    },
    setDisbursementModes: (state, action) => {
      state.disbursementModes = action.payload;
    },
    setRepaymentModes: (state, action) => {
      state.repaymentModes = action.payload;
    },

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
  setGeographyStates,
  setDeliveryChannels,
  setDisbursementModes,
  setRepaymentModes
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
      geographyRes,
      deliveryChannelsRes,
      disbursementModesRes,
      repaymentModesRes
    ] = await Promise.all([
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/associate/productCategory/getAllProductCategories`),
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/associate/segment/getAllProductSegments`),
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/associate/loan/getAllLoanTypes`),
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/associate/productCategory/getProductPurposes`),
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/associate/partner/getAllProductPartners`),
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/associate/location/getStatesByCountry/ad445591-3574-4a07-9b81-09ffedcc1bb6`),
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/associate/deliveryChannel/getAllDeliveryChannels`),
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/associate/disbursement/getAllDisbursementModes`),
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/associate/repayment/getAllRepaymentModes`)
    ]);

    dispatch(setProductCategories(productCategoriesRes.data.data));
    dispatch(setProductSegments(segmentsRes.data.data));
    dispatch(setLoanTypes(loansRes.data.data));
    dispatch(setPurposeCategories(purposesRes.data.data));
    dispatch(setPartners(partnersRes.data.data));
    dispatch(setGeographyStates(geographyRes.data.data));
    dispatch(setDeliveryChannels(deliveryChannelsRes.data.data));
    dispatch(setDisbursementModes(disbursementModesRes.data.data));
    dispatch(setRepaymentModes(repaymentModesRes.data.data));


  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export default productMetadataSlice.reducer;
