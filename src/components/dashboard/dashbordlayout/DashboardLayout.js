import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import DashboardHeader from './DashboardHeader';
import CreateProduct from '../productmanager/masterproduct/CreateProduct';
import CreateVariant from '../varient/varient';
import MasterProductTable from '../productmanager/masterproduct/MasterProductTable';
import ViewProduct from '../productmanager/masterproduct/ViewProduct';
import VersionHistory from '../productmanager/masterproduct/VersionHistory';
import ViewVersion from '../productmanager/masterproduct/ViewVersion';
import ApprovalQueue from '../productmanager/approvalqueue/ApprovalQueue';
import ProductMasterList from '../productmanager/productmasterlist/ProductMasterList';
import VarientTable from '../varient/VarientTable';
import ViewSingleVarient from '../varient/ViewSingleVarient';
import AssignPartner from '../varient/AssignParter';
import AssignPartnerTable from '../varient/AssignPartnerTable';
import EmployerOnboarding from '../ERM/employeronboarding/EmployerOnboarding';
import PartnerTable from '../ERM/employeronboarding/PartnerTable';
import AddPaymentCycle from '../ERM/employeronboarding/AddPaymentCycle';
import PaymentCycleList from '../ERM/employeronboarding/PaymentCycleList';
import PaymentCycleDetail from '../ERM/employeronboarding/PaymentCycleDetail';
import AllocatedProductsTable from '../ERM/varientallocation/AllocatedProductsTable';
import KycTable from '../operationmanager/kyc/KycTable';
import KYCDetailView from '../operationmanager/kyc/KYCDetailView';
import Navbar from '../../Navbar';

import LoanApplication from '../creditmanager/Loanapplications/LoanApplication';
import ReviewDetails from '../creditmanager/Loanapplications/ReviewDetails';
import ViewDetails from '../creditmanager/VerifiedApplications/ViewDetailsVerApp';
import ViewDetailsVerApp from '../creditmanager/VerifiedApplications/ViewDetailsVerApp';
import DeclinedApplications from '../creditmanager/DeclinedApplications';
import VerifiedApplications from '../creditmanager/VerifiedApplications/VerifiedApplications';
import LoanFieldBuilder from '../productmanager/masterproduct/FieldBuilder';
import Omloanapplications from '../operationmanager/Loanapplications/Omloanapplications';
import ViewDetailsOperationManager from '../../subcompotents/ViewDetailsOperationManager';
import KycApplicants from '../operationmanager/kycapplicants/KycApplicants';
import VerifiedKyc from '../operationmanager/verifiedKyc/VerifiedKyc';
import RecheckLoanApplication from '../operationmanager/RecheckLoanApplication';
import OverView from '../disbursalmanager/OverView';
import Disbursements from '../disbursalmanager/Disbursements';
import DisbursedLoans from '../disbursalmanager/DisbursedLoans';
import PaymentApproval from '../approvalmanager/PaymentApproval';
import ApprovedPayments from '../approvalmanager/ApprovedPayments';
import RepaymentTracks from '../approvalmanager/RepaymentTracks';
import RepaymentDetails from '../approvalmanager/RepaymentDetails';
import ProductGoNoGoPolicy from '../productmanager/masterproduct/ProductGoNoGoPolicy';
import ProductBrePolicy from '../productmanager/masterproduct/ProductBrePolicy';
import VariantGoNoGoPolicy from '../varient/VariantGoNoGoPolicy';
import VariantBrePolicy from '../varient/VariantBrePolicy';

// const SIDEBAR_WIDTH = 223;

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const allModules = useSelector((state) => state.auth.allModules);


  useEffect(() => {
    if (
      allModules?.length > 0 &&
      (location.pathname === '/' || location.pathname === '/home')
    ) {
      navigate(`/${allModules[0].path}`, { replace: true });
    }
  }, [allModules, location.pathname, navigate]);

  return (
    <div className="flex h-screen overflow-hidden bg-mainbg">
      <Navbar />

      {/* Sidebar */}
      <aside
        className={`
    fixed top-[70px] left-0 z-50
    h-[calc(100vh-70px)]
    bg-brand font-sans shadow-lg border-r border-gray-200
    transition-transform duration-300
    box-border will-change-transform

    w-[223px] min-w-[223px] max-w-[223px]

    
    overflow-x-hidden
    scrollbar-gutter-stable

    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0
  `}
      >


        <nav className="px-3 py-4">
          <ul className="space-y-1">
            {allModules?.map((item) => {
              const isActive = location.pathname.includes(item.path);
              return (
                <li
                  key={item.id}
                  onClick={() => navigate(`/${item.path}`)}
                  className={`
                   group flex items-center gap-3 px-5 py-2.5 min-w-0 w-full rounded-lg cursor-pointer
                    transition-all
                   ${isActive
                      ? 'bg-btnbg font-sans rounded-xl'
                      : 'hover:bg-[#0E81C4]/10 hover:text-[#0E81C4] text-[#5B5B5B] rounded-xl'
                    }
                  `}
                >
                  {item.icon && (
                    <img
                      src={`${process.env.REACT_APP_BACKEND_MEDIA}${item.icon}`}
                      alt={item.moduleName}
                      className="h-5 w-5 opacity-80"
                    />
                  )}
                  <span className="block min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap" title={item.moduleName}>{item.moduleName}</span>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <main
        className={`
    transition-all duration-300
    pt-[90px] px-6
   
    overflow-y-auto

    w-full
    ml-0

    md:ml-[223px]
    md:w-[calc(100%-223px)]

    ${sidebarOpen ? 'ml-[223px] w-[calc(100%-223px)]' : ''}
  `}
      >


        {/* Mobile sidebar toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setSidebarOpen((p) => !p)}
            className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 shadow"
          >
            ☰ Menu
          </button>
        </div>


        <Routes>

          {/*++++++++++++++++++++++++++ Project manager +++++++++++++++++++++++++++++++ */}
          <Route path="/home" element={<DashboardHeader />} />
          <Route path="/createproduct" element={<CreateProduct />} />
          <Route path="/createproduct/:productId" element={<CreateProduct />} />
          <Route path="/createvarient" element={<CreateVariant />} />
          <Route path="/createvarient/:variantId" element={<CreateVariant />} />
          <Route path="/masterproduct" element={<MasterProductTable />} />
          <Route path="/view-product/:id" element={<ViewProduct />} />
          <Route path="/version-history/:masterProductId" element={<VersionHistory />} />
          <Route path="/view-version/:versionId" element={<ViewVersion />} />
          <Route path="/approvalqueue" element={<ApprovalQueue />} />
          <Route path="/approvals" element={<VerifiedKyc />} />
          <Route path="/productmasterlist" element={<ProductMasterList />} />
          <Route path="varient-details/:productId" element={<VarientTable />} />
          <Route path="varient" element={<VarientTable />} />
          <Route path="/varient-details-single/:id" element={<ViewSingleVarient />} />
          <Route path="/assign-partner/:variantId" element={<AssignPartner />} />
          <Route path="/assigned-partners/:variantId" element={<AssignPartnerTable />} />
          <Route path="/variant-product-policy/:id" element={<VariantGoNoGoPolicy />} />
          <Route path="/variant-bre-policy/:id" element={<VariantBrePolicy />} />

          {/*++++++++++++++++++++++++++ Product manager +++++++++++++++++++++++++++++++ */}
          <Route path="/product-manager" element={<MasterProductTable />} />
          <Route path="/add-fields/:productId" element={<LoanFieldBuilder />} />
          <Route path="/product-policy/:productId" element={<ProductGoNoGoPolicy />} />
          <Route path="/productbre-policy/:productId" element={<ProductBrePolicy />} />
          {/* ++++++++++++++++++++++++++++ ERM +++++++++++++++++++++++++++++++++ */}
          <Route path="/employeronboarding" element={<EmployerOnboarding />} />
          <Route path="/partnerlist" element={<PartnerTable />} />
          <Route path="/payment-cycle-list/:employerId" element={<PaymentCycleList />} />
          <Route path="/add-payment-cycle/:employerId/:contractCombinationId" element={<AddPaymentCycle />} />
          <Route path="/payment-cycle-detail/:contractId" element={<PaymentCycleDetail />} />
          <Route path="/varientallocation" element={<AllocatedProductsTable />} />

          {/*++++++++++++++++++++++++++ Credit manager ++++++++++++++++++++++++++++++ */}
          <Route path="loanapplications" element={<LoanApplication />} />
          <Route path="/loan-applications/review-details/:loanId" element={<ViewDetailsOperationManager />} />
          <Route path="declinedapplications" element={<DeclinedApplications />} />
          <Route path="/declined-applications/view-details" element={<ViewDetails />} />
          <Route path="verifiedapplications" element={<VerifiedKyc />} />
          <Route path="/verified-applications/view-details/:loanId" element={<ViewDetailsOperationManager />} />

          {/*++++++++++++++++++++++++++ Operation manager ++++++++++++++++++++++++++++++ */}
          <Route path="/kyc" element={<KycTable />} />
          <Route path="/kyc-detail/:id" element={<KYCDetailView />} />
          <Route path="/omloanapplications" element={<Omloanapplications />} />
          <Route path="/omloanapplications/view-details/:loanId" element={<ViewDetailsOperationManager />} />
          <Route path="/kyc-applicants" element={<KycApplicants />} />
          <Route path="/kyc-applicants/view-details/:loanId" element={<ViewDetailsOperationManager />} />
          <Route path="/verified-kyc" element={<VerifiedKyc />} />
          <Route path="/recheck-loans" element={<RecheckLoanApplication />} />

          {/*++++++++++++++++++++++++++ Disbursement manager ++++++++++++++++++++++++++++++ */}
          <Route path="/overview" element={<OverView />} />
          <Route path="/disbursements" element={<Disbursements />} />
          <Route path="/disbursed-loans" element={<DisbursedLoans />} />


          {/*++++++++++++++++++++++++++ Approval manager ++++++++++++++++++++++++++++++ */}
          <Route path="/payments-approval" element={<PaymentApproval />} />
          <Route path="/approved-payments" element={<ApprovedPayments />} />
          <Route path="/repayments-track" element={<RepaymentTracks />} />
          <Route path="/repayment-details" element={<RepaymentDetails />} />

        </Routes>

      </main>
    </div>
  );
};

export default DashboardLayout;
