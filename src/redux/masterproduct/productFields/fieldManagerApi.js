import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

const initialState = {
    loading: false,
    error: null,

    sectionKeys: [],        
    fieldKeysBySection: {}, 
};


const fieldManagerSlice = createSlice({
    name: "fieldManager",
    initialState,
    reducers: {
        requestStart: (state) => {
            state.loading = true;
            state.error = null;
        },

        requestSuccess: (state) => {
            state.loading = false;
        },

        requestFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        setSectionKeys: (state, action) => {
            state.sectionKeys = action.payload;
        },

        setFieldKeysBySection: (state, action) => {
            const { sectionKeyId, fields } = action.payload;
            state.fieldKeysBySection[sectionKeyId] = fields;
        },
    },
});


export const {
    requestStart,
    requestSuccess,
    requestFailure,
    setSectionKeys,
    setFieldKeysBySection,
} = fieldManagerSlice.actions;




export const fetchSectionKeys = () => async (dispatch) => {
    dispatch(requestStart());
    try {
        const accessToken = localStorage.getItem('accessToken');
        const res = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/associate/field/getAllSectionKeysForManager`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        dispatch(setSectionKeys(res.data.data.data));
        dispatch(requestSuccess());
    } catch (err) {
        const message =
            err?.response?.data?.message || "Failed to fetch section keys";

        dispatch(requestFailure(message));
        enqueueSnackbar(message, { variant: "error" });
    }
};


export const fetchFieldKeysBySectionId =
    (sectionKeyId) => async (dispatch, getState) => {
        const { fieldKeysBySection } = getState().fieldManager;

       
        if (fieldKeysBySection[sectionKeyId]) return;

        dispatch(requestStart());
        try {
            const accessToken = localStorage.getItem('accessToken');
            const res = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/associate/field/getAllFieldKeysForManager?sectionKeyId=${sectionKeyId}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            dispatch(
                setFieldKeysBySection({
                    sectionKeyId,
                    fields: res.data.data.data,
                })
            );

            dispatch(requestSuccess());
        } catch (err) {
            const message =
                err?.response?.data?.message || "Failed to fetch field keys";

            dispatch(requestFailure(message));
            enqueueSnackbar(message, { variant: "error" });
        }
    };

export default fieldManagerSlice.reducer;
