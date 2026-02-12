import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    loading: false,
    keys: [],
    error: null,
};

const variantGoNoGoKeysSlice = createSlice({
    name: "variantGoNoGoKeys",
    initialState,
    reducers: {
        fetchKeysStart: (state) => {
            state.loading = true;
            state.error = null;
        },

        fetchKeysSuccess: (state, action) => {
            state.loading = false;
            state.keys = action.payload;
        },

        fetchKeysFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        clearKeysState: (state) => {
            state.loading = false;
            state.keys = [];
            state.error = null;
        },
    },
});

export const {
    fetchKeysStart,
    fetchKeysSuccess,
    fetchKeysFailure,
    clearKeysState,
} = variantGoNoGoKeysSlice.actions;

export default variantGoNoGoKeysSlice.reducer;


export const fetchGoNoGoKeys = () => async (dispatch) => {
    dispatch(fetchKeysStart());

    try {
        const accessToken = localStorage.getItem("accessToken");

        const res = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/associateSubAdmin/bre/getGoNoGoKeys`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        const formattedKeys =
            res.data?.data?.map((k) =>
                typeof k === "string" ? k : k.key
            ) || [];

        dispatch(fetchKeysSuccess(formattedKeys));
    } catch (error) {
        const message =
            error?.response?.data?.message ||
            "Failed to load Go/No-Go keys";

        dispatch(fetchKeysFailure(message));
    }
};
