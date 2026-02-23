// CreateProduct.js
import React, { useEffect } from 'react';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, Tab, Tabs, Button, Typography, Alert, Paper } from '@mui/material';
import GeneralProductMetadata from './GeneralProductMetadata';
import ProductParameters from './ProductParameters';
import EligibilityCriteria from './EligibilityCriteria';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CreditBureauParametersConfiguration from './CreditBureauParametersConfiguration';
// import FinancialStatementParameters from './FinancialStatementParameters';
// import BehavioralTransactionDataParameters from './BehavioralTransactionDataParameters';
import OtherCharges from './OtherCharges';
import CreditCriteria from '../masterproduct/CreditCriteria'
// import TimelyRepaymentIncentives from './TimelyRepaymentIncentives';
// import RiskScoringInputs from './RiskScoringInputs';
// import CreditEngineConfigurationParameters from './CreditEngineConfigurationParameters';
// import DecisionActionLogging from './DecisionActionLogging';
// import CollateralGuaranteeData from './CollateralGuaranteeData';
// import ComplianceRegulatoryChecks from './ComplianceRegulatoryChecks';
// import UserSystemInteractionLogs from './UserSystemInteractionLogs';
// import { generalProductValidationSchema } from './GeneralProductMetadata';
// import { productParameterValidationSchema } from './ProductParameters';
// import { useDispatch } from 'react-redux';
// import { useSnackbar } from 'notistack';
// import { createGeneralProduct } from '../../../../redux/masterproduct/productmetadata/createProductSlice';
// import { submitFinancialTerms } from '../../../../redux/masterproduct/productparameter/financialTermsSlice';
// import { submitEligibilityCriteria } from '../../../../redux/masterproduct/eligibilitycriteria/employmentTypesSlice';
import { useLocation, useParams } from 'react-router-dom';
import { fetchProductDetails } from '../../../../redux/masterproduct/tableslice/productsSlice';
// import AddFields from './AddFields';
import { useDispatch } from 'react-redux';


const CreateProduct = () => {
    const { productId } = useParams()
    const dispatch = useDispatch()
    const location = useLocation()
    const mode = location.state?.mode || null;
    const status = location.state?.status || null;
    const isEditMode = mode === 'EDIT';

    const [tabIndex, setTabIndex] = React.useState(0);

    // const handleTabChange = (_, newValue) => setTabIndex(newValue);
    const handleTabChange = (_, newValue) => {
        if (!isEditMode) return;
        setTabIndex(newValue);
    };


    useEffect(() => {
        if (mode === "EDIT" && productId) {
            dispatch(fetchProductDetails(productId));
        }
    }, [mode, productId, dispatch])

    const tabs = [
        'General product metadata',
        'Product parameters',
        'Other Charges',
        'Eligibility criteria',
        // 'Credit bureau parameters configuration',
        'Credit Criteria',
    ];
    const totalTabs = tabs?.length;

    return (
        <>
            <div className="p-4 bg-white rounded-lg shadow-md">
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={2}
                >
                    <Box display="flex" alignItems="center" gap={1}>
                        <svg width="26" height="30" viewBox="0 0 26 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.6667 27.9719C12.0721 28.206 12.5319 28.3292 13 28.3292C13.4681 28.3292 13.9279 28.206 14.3333 27.9719L23.6667 22.6386C24.0717 22.4048 24.408 22.0685 24.6421 21.6637C24.8761 21.2588 24.9995 20.7995 25 20.3319V9.66523C24.9995 9.1976 24.8761 8.73831 24.6421 8.33345C24.408 7.92859 24.0717 7.59238 23.6667 7.35857L14.3333 2.02523C13.9279 1.79119 13.4681 1.66797 13 1.66797C12.5319 1.66797 12.0721 1.79119 11.6667 2.02523L2.33333 7.35857C1.92835 7.59238 1.59197 7.92859 1.35795 8.33345C1.12392 8.73831 1.00048 9.1976 1 9.66523V20.3319C1.00048 20.7995 1.12392 21.2588 1.35795 21.6637C1.59197 22.0685 1.92835 22.4048 2.33333 22.6386L11.6667 27.9719Z" stroke="#084E77" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M13 28.3319V14.9985" stroke="#084E77" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M1.38672 8.33179L13.0001 14.9985L24.6134 8.33179" stroke="#084E77" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M7 4.69189L19 11.5586" stroke="#084E77" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <h1 className="text-[24px] font-semibold my-3 flex gap-2">  {isEditMode ? 'Edit Product' : 'Create Product'}</h1>
                    </Box>
                    {!isEditMode && (
                        <Alert
                            severity="info"
                            variant="outlined"
                            icon={<InfoOutlinedIcon fontSize="small" />}
                            sx={{
                                py: 0.3,
                                px: 1.25,
                                borderRadius: '8px',
                                fontSize: '0.8rem',
                                color: '#084E77',
                                borderColor: '#084E77',
                                backgroundColor: 'transparent',
                                '& .MuiAlert-icon': {
                                    color: '#084E77',
                                },
                            }}
                        >
                            You can edit this product later.
                        </Alert>
                    )}

                </Box>
                <Box sx={{ width: '100%' }}>
                    <Paper>
                        <Tabs value={tabIndex} onChange={handleTabChange} indicatorColor="primary" variant="fullWidth" scrollButtons="auto" textColor="inherit" TabIndicatorProps={{
                            sx: {
                                height: 2,
                                backgroundColor: '#084E77',
                            },
                        }}
                            sx={{
                                minHeight: 'unset',
                                '& .MuiTabs-flexContainer': {
                                    // gap: 1,
                                    width: '100%',
                                },
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontSize: 14,
                                    minHeight: 'unset',
                                    color: '#6B7280',
                                    backgroundColor: '#084E770A',
                                    // flex: 1,          
                                    // minWidth: 0,      
                                    // px: 2,
                                    // whiteSpace: 'nowrap',
                                },
                                '& .Mui-selected': {
                                    color: '#084E77',
                                    fontWeight: 500,
                                },
                                '& .MuiTabs-scrollButtons': {
                                    opacity: 1,
                                },
                                '& .MuiTabs-scrollButtons.Mui-disabled': {
                                    opacity: 0.3,
                                },
                            }}>
                            {tabs.map(label => (
                                <Tab key={label} label={label} />
                            ))}
                        </Tabs>
                    </Paper>

                    <Box mt={3}>
                        {tabIndex === 0 && <GeneralProductMetadata handleTabChange={handleTabChange} tabIndex={tabIndex} setTabIndex={setTabIndex} totalTabs={totalTabs} status={status} />}
                        {tabIndex === 1 && <ProductParameters handleTabChange={handleTabChange} tabIndex={tabIndex} setTabIndex={setTabIndex} totalTabs={totalTabs} status={status} />}
                        {/* {tabIndex === 2 && <OtherCharges handleTabChange={handleTabChange} tabIndex={tabIndex} setTabIndex={setTabIndex} />}
                            {tabIndex === 3 && <TimelyRepaymentIncentives handleTabChange={handleTabChange} tabIndex={tabIndex} setTabIndex={setTabIndex} />} */}
                        {tabIndex === 2 && <OtherCharges handleTabChange={handleTabChange} tabIndex={tabIndex} setTabIndex={setTabIndex} totalTabs={totalTabs} status={status} />}
                        {tabIndex === 3 && <EligibilityCriteria handleTabChange={handleTabChange} tabIndex={tabIndex} setTabIndex={setTabIndex} totalTabs={totalTabs} status={status} />}
                        {/* {tabIndex === 4 && <CreditBureauParametersConfiguration handleTabChange={handleTabChange} tabIndex={tabIndex} setTabIndex={setTabIndex} totalTabs={totalTabs} status={status} />} */}
                        {tabIndex === 4 && <CreditCriteria handleTabChange={handleTabChange} tabIndex={tabIndex} setTabIndex={setTabIndex} totalTabs={totalTabs} status={status} />}
                        {/* {tabIndex === 5 && <AddFields handleTabChange={handleTabChange} tabIndex={tabIndex} setTabIndex={setTabIndex} />} */}
                        {/* {tabIndex === 5 && <BehavioralTransactionDataParameters handleTabChange={handleTabChange} tabIndex={tabIndex} setTabIndex={setTabIndex} />}
                        {tabIndex === 6 && <RiskScoringInputs handleTabChange={handleTabChange} tabIndex={tabIndex} setTabIndex={setTabIndex} />} */}
                        {/* {tabIndex === 9 && <CreditEngineConfigurationParameters />} */}
                        {/* {tabIndex === 10 && <DecisionActionLogging />} */}
                        {/* {tabIndex === 7 && <CollateralGuaranteeData handleTabChange={handleTabChange} tabIndex={tabIndex} setTabIndex={setTabIndex} />}

                        {tabIndex === 8 && <FinancialStatementParameters handleTabChange={handleTabChange} tabIndex={tabIndex} setTabIndex={setTabIndex} />}
                        {tabIndex === 9 && <TimelyRepaymentIncentives handleTabChange={handleTabChange} tabIndex={tabIndex} setTabIndex={setTabIndex} />} */}
                        {/* {tabIndex === 12 && <ComplianceRegulatoryChecks />}
                            {tabIndex === 13 && <UserSystemInteractionLogs />} */}
                    </Box>
                </Box>
            </div>
        </>

    );
};

export default CreateProduct;
