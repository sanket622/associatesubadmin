import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../components/auth/redux/auth/authSlice';
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
import kycReducer from '../components/dashboard/operationmanager/redux/kyc/kycSlice';
import productFieldsReducer from
    '../redux/masterproduct/productFields/productFieldsSlice';
import fieldManagerReducer from "../redux/masterproduct/productFields/fieldManagerApi";

import pendingLoanReducer from './getPendingLoans/getpendingloanslice';
import appliedLoanReducer from './getPendingLoans/getappliedloansslice'

import kycApplicantsReducer from '../redux/creditManager/kycApplicantsSlice';

import masterProductUpdateReducer from
    '../redux/masterproduct/editmasterproduct/masterProductUpdateSlice';

import recheckLoanReducer from './getPendingLoans/recheckLoanSlice'

import loanDetailsReducer from '../redux/getPendingLoans/loanDetailsslice';
import loanManagerHistoryReducer from './getPendingLoans/loanManagerHistorySlice';
import customerReviewDetailsReducer from './getPendingLoans/customerReviewDetailsSlice';
import masterProductCreateRequestReducer from '../redux/masterproduct/createmasterproductrequest/masterProductCreateRequestSlice';
import variantProductCreateRequestReducer from
    '../redux/varient/createvariantproductrequest/variantProductCreateRequestSlice';

import updateMasterProductDraftReducer from
    './masterproduct/masterproductdraftslice/masterproductdraft';

import updateVariantProductDraftReducer from '../redux/varient/variantdraftupdateslice/variantdraftupdateslice';

import variantGoNoGoKeysReducer
    from "../redux/varient/variantGoNoGoKeysSlice";

import geographyReducer from '../redux/varient/geographySlice';
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
        variantProductCreateRequest: variantProductCreateRequestReducer,
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

        masterProductUpdate: masterProductUpdateReducer,
        masterProductCreateRequest: masterProductCreateRequestReducer,
        updateMasterProductDraft: updateMasterProductDraftReducer,
        // ++++++++++++ opretation manager +++++++++++++++++

        variantGoNoGoKeys: variantGoNoGoKeysReducer,
        updateVariantProductDraft: updateVariantProductDraftReducer,
        geography: geographyReducer,

        kyc: kycReducer,
        kycApplicants: kycApplicantsReducer,
        appliedLoans: appliedLoanReducer,
        pendingLoans: pendingLoanReducer,
        loanManagerHistory: loanManagerHistoryReducer,
        productFields: productFieldsReducer,
        fieldManager: fieldManagerReducer,
        loanDetails: loanDetailsReducer,
        customerReviewDetails: customerReviewDetailsReducer,
        recheckLoans: recheckLoanReducer
    },
});
