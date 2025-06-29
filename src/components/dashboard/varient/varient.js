// CreateVariant.js
import React, { useEffect, useState } from 'react';
import { Box, Tab, Tabs, Button } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import BasicInformation from './createvarient/BasicInformation';
import VariantParameters from './createvarient/VariantParameters';
import OtherCharges from './createvarient/OtherCharges';
import TimelyRepaymentIncentives from './createvarient/TimelyRepaymentIncentives';
import { useLocation, useParams } from 'react-router-dom';
import { fetchVariantProductDetail } from '../../../redux/varient/variantSingleSlice';
import { useDispatch } from 'react-redux';


const CreateVariant = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const {variantId} = useParams();
    const dispatch = useDispatch()
    const handleTabChange = (_, newValue) => setTabIndex(newValue);
    const location = useLocation();
    const mode = location.state?.mode || null;
    const isEditMode = mode === 'EDIT';

      useEffect(() => {
            if (mode === "EDIT" && variantId) {
                dispatch(fetchVariantProductDetail(variantId))
            }
        }, [variantId])
    


    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h1 className="text-[24px] font-semibold my-3 flex gap-2">
                <svg width="26" height="30" viewBox="0 0 26 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.6667 27.9719C12.0721 28.206 12.5319 28.3292 13 28.3292C13.4681 28.3292 13.9279 28.206 14.3333 27.9719L23.6667 22.6386C24.0717 22.4048 24.408 22.0685 24.6421 21.6637C24.8761 21.2588 24.9995 20.7995 25 20.3319V9.66523C24.9995 9.1976 24.8761 8.73831 24.6421 8.33345C24.408 7.92859 24.0717 7.59238 23.6667 7.35857L14.3333 2.02523C13.9279 1.79119 13.4681 1.66797 13 1.66797C12.5319 1.66797 12.0721 1.79119 11.6667 2.02523L2.33333 7.35857C1.92835 7.59238 1.59197 7.92859 1.35795 8.33345C1.12392 8.73831 1.00048 9.1976 1 9.66523V20.3319C1.00048 20.7995 1.12392 21.2588 1.35795 21.6637C1.59197 22.0685 1.92835 22.4048 2.33333 22.6386L11.6667 27.9719Z" stroke="#0000FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M13 28.3319V14.9985" stroke="#0000FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M1.38672 8.33179L13.0001 14.9985L24.6134 8.33179" stroke="#0000FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 4.69189L19 11.5586" stroke="#0000FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {isEditMode ? 'Edit Variant' : 'Create Variant'}
            </h1>

            <Box sx={{ width: '100%' }}>
                <Tabs value={tabIndex} onChange={handleTabChange} indicatorColor="primary" variant="scrollable" scrollButtons="auto" textColor="inherit" sx={{ backgroundColor: '#F5F5FF', '& .MuiTabs-indicator': { backgroundColor: '#0000FF' }, '& .MuiTab-root': { color: '#424242', textTransform: 'capitalize', whiteSpace: 'normal', lineHeight: 1.2, minHeight: 'auto', }, '& .Mui-selected': { color: '#0000FF' } }}>
                    <Tab label="Basic Information" />
                    <Tab label="varient Parameter" />
                    <Tab label="Other Charges" />
                    <Tab label="Timely Repayment Incentives" />
                </Tabs>

                <Box mt={3}>
                    {tabIndex === 0 && <BasicInformation handleTabChange={handleTabChange} tabIndex={tabIndex} setTabIndex={setTabIndex}  />}
                    {tabIndex === 1 && <VariantParameters handleTabChange={handleTabChange} tabIndex={tabIndex} setTabIndex={setTabIndex} />}
                    {tabIndex === 2 && <OtherCharges handleTabChange={handleTabChange} tabIndex={tabIndex} setTabIndex={setTabIndex} />}
                    {tabIndex === 3 && <TimelyRepaymentIncentives handleTabChange={handleTabChange} tabIndex={tabIndex} setTabIndex={setTabIndex} />}
                </Box>
            </Box>
        </div>
    );
};

export default CreateVariant;
