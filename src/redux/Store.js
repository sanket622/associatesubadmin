import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/auth/authSlice';
import employeeReducer from './employee/employeeSlice';
import roleModuleReducer from './managerole/roleModuleSlice';
import productMetadataReducer from '../redux/masterproduct/productmetadata/productMetadataSlice';
import employmentTypesReducer from './masterproduct/eligibilitycriteria/employmentTypesSlice';
import riskReducer from '../redux/masterproduct/riskscoring/riskSlice';
import createProductReducer from '../redux/masterproduct/productmetadata/createProductSlice';
import financialTermsReducer from '../redux/masterproduct/productparameter/financialTermsSlice';
import creditBureauConfigReducer from '../redux/masterproduct/creditbreuconfig/creditBureauConfigSlice';
import financialStatementReducer from '../redux/masterproduct/financialstatement/financialStatementSlice';
import behavioralDataReducer from '../redux/masterproduct/behaviraldata/behavioralDataSlice';
import riskScoringReducer from './masterproduct/riskscoring/riskScoringSubmitSlice';
import collateralSubmitReducer from './masterproduct/colateralandgurantee/collateralSubmitSlice';
import productsReducer from '../redux/masterproduct/tableslice/productsSlice';
import deleteProductReducer from '../redux/masterproduct/tableslice/deleteProductSlice';
import approvalQueueReducer from '../redux/approvalqueue/approvalQueueSlice';
import variantProductSubmitReducer from '../redux/varient/submitslice/variantProductSubmitSlice';
import variantProductParameterSubmitReducer from '../redux/varient/submitslice/variantProductParameterSubmitSlice';
import variantProductOtherChargesSubmitReducer from './varient/submitslice/variantProductOtherChargesSubmitSlice';
import variantProductRepaymentSubmitReducer from './varient/submitslice/variantProductRepaymentSubmit';
import variantProductsReducer from './varient/variantProductsSlice';
import variantSingleReducer from './varient/variantSingleSlice';
import employerAssignmentReducer from './varient/employerAssignmentSlice';
import archiveVariantReducer from './varient/archiveVariantSlice';
import employerOnboardingReducer from '../components/dashboard/ERM/redux/employeronboarding/employerOnboardingSlice';
import paymentCycleReducer from '../components/dashboard/ERM/redux/employeronboarding/paymentCycleSlice';
import contractRuleReducer from '../components/dashboard/ERM/redux/employeronboarding/contractRuleSlice';
import otherChargesReducer from './masterproduct/othercharges/otherChargesSlice';
import timelyRepaymentReducer from './masterproduct/timelyrepayment/timelyRepaymentSlice';
import featuresReducer from '../components/dashboard/ERM/redux/varientallocation/featuresSlice';
import productAllocationReducer from '../components/dashboard/ERM/redux/varientallocation/productAllocationSlice';
import allocatedProductsReducer from '../components/dashboard/ERM/redux/varientallocation/allocatedProductsSlice';


export const store = configureStore({
    reducer: {
        auth: authReducer,
        employee: employeeReducer,
        roleModule: roleModuleReducer,
        productMetadata: productMetadataReducer,
        employmentTypes: employmentTypesReducer,
        risk: riskReducer,
        createProduct: createProductReducer,
        financialTerms: financialTermsReducer,
        creditBureauConfig: creditBureauConfigReducer,
        financialStatement: financialStatementReducer,
        behavioralData: behavioralDataReducer,
        riskSubmit: riskScoringReducer,
        collateralsubmit: collateralSubmitReducer,
        products: productsReducer,
        deleteProduct: deleteProductReducer,
        approvalQueue: approvalQueueReducer,
        variantProductSubmit: variantProductSubmitReducer,
        variantProductParameterSubmit: variantProductParameterSubmitReducer,
        variantProductOtherChargesSubmit: variantProductOtherChargesSubmitReducer,
        variantProductRepaymentSubmit: variantProductRepaymentSubmitReducer,
        variantProducts: variantProductsReducer,
        variantSingle: variantSingleReducer,
        employerAssignment: employerAssignmentReducer,
        archiveVariant: archiveVariantReducer,
        employerOnboarding: employerOnboardingReducer,
        paymentCycle: paymentCycleReducer,
        contractRule: contractRuleReducer,
        otherCharges: otherChargesReducer,
        timelyRepayment: timelyRepaymentReducer,
        features: featuresReducer,
        productAllocation: productAllocationReducer,
        allocatedProducts: allocatedProductsReducer,
    },
});
