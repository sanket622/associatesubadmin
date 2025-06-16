import axios from "axios";
import { useNavigate } from "react-router";

 const BASE_URL = "http://64.227.166.238:8090/employer/";
 const MEDIA_URL = "https://apis.agrisarathi.com/";


export const EmployerRegistration = `${BASE_URL}EmployerRegistration`;
export const EmployerLogin = `${BASE_URL}EmployerLogin`;
export const AddEmployeeByEmployerView = `${BASE_URL}AddEmployeeByEmployerView`;
export const BulkEmployeeAdd = `${BASE_URL}BulkEmployeeAdd`;
export const GetHomeScreenKPI = `${BASE_URL}GetHomeScreenKPI`;




// #########fpo urls############


export const mediaUrl = `${MEDIA_URL}`


export const useApis = () => {
    
    const navigate = useNavigate()

    const postJson = async (url, data) => {
        const accessToken = localStorage.getItem('access_token');

        if (!accessToken) {
            navigate('/login'); // Navigate if there's no token
            return;
        }

        try {
            const res = await axios.post(`${BASE_URL}${url}`, data, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            return res; // Return the response if needed
        } catch (error) {
            if (error.response && error.response.data?.code === 'token_not_valid') {
                // Navigate to  if token is invalid or expired
                localStorage.clear()
                navigate('/login');

            } else {
                // Handle other errors (e.g., network issues, server errors)
                console.error('API error:', error);
                throw error;
            }
        }
    };

    const putJson = async (url, data) => {
        const accessToken = localStorage.getItem('access_token');

        if (!accessToken) {
            navigate('/login'); // Navigate if there's no token
            return;
        }

        try {
            const res = await axios.put(`${BASE_URL}${url}`, data, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            
            return res; // Return the response if needed
        } catch (error) {
            if (error.response && error.response.data?.code === 'token_not_valid') {
                // Navigate to  if token is invalid or expired
                localStorage.clear()
                navigate('/login');
            } else {
                // Handle other errors (e.g., network issues, server errors)
                console.error('API error:', error);
                throw error;
            }
        }
    };

    const postFormData = async (url, data) => {
        const accessToken = localStorage.getItem('access_token');

        if (!accessToken) {
            navigate('/login'); // Navigate if there's no token
            return;
        }

        try {
            const res = await axios.post(`${BASE_URL}${url}`, data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "multipart/form-data", // Set the content type for file upload
                  },
            });

            return res; // Return the response if needed
        } catch (error) {
            if (error.response && error.response.data?.code === 'token_not_valid') {
                // Navigate to  if token is invalid or expired
                localStorage.clear()
                navigate('/login');
            } else {
                // Handle other errors (e.g., network issues, server errors)
                console.error('API error:', error);
                throw error;
            }
        }
    };

    const putFormData = async (url, data) => {
        const accessToken = localStorage.getItem('access_token');

        if (!accessToken) {
            navigate('/login'); // Navigate if there's no token
            return;
        }

        try {
            const res = await axios.put(`${BASE_URL}${url}`, data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "multipart/form-data", // Set the content type for file upload
                  },
            });
            
            return res; // Return the response if needed
        } catch (error) {
            if (error.response && error.response.data?.code === 'token_not_valid') {
                // Navigate to  if token is invalid or expired
                localStorage.clear()
                navigate('/login');
            } else {
                // Handle other errors (e.g., network issues, server errors)
                console.error('API error:', error);
                throw error;
            }
        }
    };

    const getJson = async (url, params) => {
        const accessToken = localStorage.getItem('access_token');

        if (!accessToken) {
            navigate('/login'); // Navigate if there's no token
            return;
        }

        try {
            const res = await axios.get(`${BASE_URL}${url}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                params
            });
            
            return res; // Return the response if needed
        } catch (error) {
            if (error.response && error.response.data?.code === 'token_not_valid') {
                // Navigate to  if token is invalid or expired
                localStorage.clear()
                navigate('/login');
            } else {
                // Handle other errors (e.g., network issues, server errors)
                console.error('API error:', error);
                throw error;
            }
        }
    };


    return { postJson, putJson, postFormData, putFormData, getJson};
};


