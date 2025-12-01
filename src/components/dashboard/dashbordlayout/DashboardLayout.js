import React, { useState } from 'react';
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

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredModules = useSelector((state) => state.auth.filteredModules);
  console.log(filteredModules);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex bg-gray-50" style={{ height: '100vh' }}>
      <Navbar />
      <div
        style={{ boxShadow: '2px 0 5px rgba(0, 0, 0, 0.2)' }}
        className={`bg-white text-black font-semibold text-[16px] px-4 pb-2 w-[250px] h-screen overflow-y-auto fixed top-0 left-0 bottom-0 z-0 transform transition-transform md:relative md:block ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0`}
      >
        <ul className="space-y-4 mt-24">
          {filteredModules.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <li
                key={item.id}
                onClick={() => navigate(`/${item.path}`)}
                className={`relative flex items-center px-5 py-2.5 cursor-pointer gap-3 transition-all ${isActive
                    ? 'bg-[#0000FF] font-medium rounded-xl text-white'
                    : 'hover:bg-[#0000FF] hover:text-white text-[#5B5B5B] rounded-xl'
                  }`}
              >
                {/* Optional: Show icon if available */}
                {item.icon && (
                  <img
                    src={item.icon}
                    alt={item.moduleName}
                    style={{ width: 20, height: 20 }}
                    className="inline-block  "
                  />
                )}
                <span>{item.moduleName}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex-1 p-6 ml-0 md:ml-4 min-h-screen overflow-y-scroll">
        <div className="w-full relative">
          <div className="flex justify-end items-center">
            <button className="md:hidden mt-20 text-black" onClick={toggleSidebar}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <div className="mt-16">
            <Routes>

              {/*++++++++++++++++++++++++++ Project manager +++++++++++++++++++++++++++++++ */}

              <Route path="/home" element={<DashboardHeader />} />
              <Route path="/createproduct" element={< CreateProduct />} />
              <Route path="/createproduct/:productId" element={<CreateProduct />} />
              <Route path="/createvarient" element={< CreateVariant />} />
              <Route path="/createvarient/:variantId" element={< CreateVariant />} />
              <Route path="/masterproduct" element={< MasterProductTable />} />
              <Route path="/view-product/:id" element={<ViewProduct />} />
              <Route path="/version-history/:masterProductId" element={<VersionHistory />} />
              <Route path="/view-version/:versionId" element={<ViewVersion />} />
              <Route path="/approvalqueue" element={<ApprovalQueue />} />
              <Route path="/productmasterlist" element={<ProductMasterList />} />
              <Route path="varient-details/:productId" element={<VarientTable />} />
              <Route path="/varient-details-single/:id" element={<ViewSingleVarient />} />
              <Route path="/assign-partner/:variantId" element={<AssignPartner />} />
              <Route path="/assigned-partners/:variantId" element={<AssignPartnerTable />} />

              {/* ++++++++++++++++++++++++++++ ERM +++++++++++++++++++++++++++++++++ */}

              <Route path="/employeronboarding" element={<EmployerOnboarding />} />
              <Route path="/partnerlist" element={<PartnerTable />} />
              <Route path="/payment-cycle-list/:employerId" element={<PaymentCycleList />} />
              <Route path="/add-payment-cycle/:employerId/:contractCombinationId" element={<AddPaymentCycle />} />
              <Route path="/payment-cycle-detail/:contractId" element={<PaymentCycleDetail />} />
              <Route path="/varientallocation" element={<AllocatedProductsTable />} />

              {/*++++++++++++++++++++++++++ Operation manager ++++++++++++++++++++++++++++++ */}

              <Route path="/kyc" element={<KycTable />} />
              <Route path="/kyc-detail/:id" element={<KYCDetailView />} />


            </Routes>
          </div>
        </div>
      </div>
    </div>

  );
};

export default DashboardLayout;