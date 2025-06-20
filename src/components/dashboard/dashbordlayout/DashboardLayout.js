import React, { useState } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import GroupsIcon from '@mui/icons-material/Groups';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import Navbar from '../../Navbar';
import DashboardHeader from './DashboardHeader';
import Employees from '../manageroles/ManageRoles';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PersonIcon from '@mui/icons-material/Person';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import ManageEmployer from '../manageroles/ManageRoles';
import ManageRoles from '../manageroles/ManageRoles';
import CreateProduct from '../masterproduct/CreateProduct';
import CreateVariant from '../varient/varient';
import MasterProductTable from '../masterproduct/MasterProductTable';
import ViewProduct from '../masterproduct/ViewProduct';
import VersionHistory from '../masterproduct/VersionHistory';
import ViewVersion from '../masterproduct/ViewVersion';
import ApprovalQueue from '../approvalqueue/ApprovalQueue';
import ProductMasterList from '../productmasterlist/ProductMasterList';
import VarientTable from '../varient/VarientTable';
import ViewSingleVarient from '../varient/ViewSingleVarient';
import AssignPartner from '../varient/AssignParter';
import AssignPartnerTable from '../varient/AssignPartnerTable';
import EmployerOnboarding from '../ERM/employeronboarding/EmployerOnboarding';
import PartnerTable from '../ERM/employeronboarding/PartnerTable';
import AddPaymentCycle from '../ERM/employeronboarding/AddPaymentCycle';
import PaymentCycleList from '../ERM/employeronboarding/PaymentCycleList';
import PaymentCycleDetail from '../ERM/employeronboarding/PaymentCycleDetail';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const TABS = [
    // { label: "Dashboard", path: 'home', icon: <DashboardIcon />, outlinedIcon: <DashboardOutlinedIcon />, component: <DashboardHeader /> },
    // { label: "Manage Roles", path: 'manageroles', icon: <PeopleAltIcon />, outlinedIcon: <PeopleOutlineOutlinedIcon />, component: <ManageRoles /> },
    { label: "Create Product", path: 'createproduct', icon: <AnalyticsIcon />, outlinedIcon: <AnalyticsOutlinedIcon />, },
    { label: "Create Varient", path: 'createvarient', icon: <AnalyticsIcon />, outlinedIcon: <AnalyticsOutlinedIcon />, },
    { label: "Master product", path: 'masterproduct', icon: <AnalyticsIcon />, outlinedIcon: <AnalyticsOutlinedIcon />, },
    { label: "Approval Queue", path: 'approvalqueue', icon: <AnalyticsIcon />, outlinedIcon: <AnalyticsOutlinedIcon />, },
    { label: "Product Master List", path: 'productmasterlist', icon: <AnalyticsIcon />, outlinedIcon: <AnalyticsOutlinedIcon />, },
    { label: "Employer Onboarding", path: 'employeronboarding', },
    { label: "Partner List", path: 'partnerlist', },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex bg-gray-50" style={{ height: "100vh" }}>
      <Navbar />

      {/* <div
        style={{ height: 800, paddingBottom: 5, boxShadow: '2px 0 5px rgba(0, 0, 0, 0.2)' }}
        className={`bg-white text-black font-semibold text-[16px] pl-6 pt-6 w-[250px] min-h-full fixed top-0 left-0 bottom-0 z-0 transform transition-transform md:relative md:block ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      > */}

      <div
        style={{ boxShadow: '2px 0 5px rgba(0, 0, 0, 0.2)' }}
        className={`bg-white text-white font-semibold text-[16px] px-4 pb-2 w-[250px] h-screen overflow-y-auto fixed top-0 left-0 bottom-0 z-0 transform transition-transform md:relative md:block ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <ul className="space-y-4 mt-24">
          {TABS.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <li
                key={item.path}
                onClick={() => navigate(`/${item.path}`)}
                className={`relative flex items-center px-5 py-2.5 cursor-pointer gap-3 transition-all ${isActive ? 'bg-[#0000FF] font-medium rounded-xl' : 'hover:bg-[#0000FF] hover:text-white text-[#5B5B5B] rounded-xl'}`}
              >
                <span>{isActive ? item.icon : item.outlinedIcon}</span>
                <span>{item.label}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex-1 p-6 ml-0 md:ml-4 min-h-screen overflow-y-scroll">
        <div className="w-full relative">
          <div className="flex justify-end items-center">
            <button className="md:hidden mt-20 text-black" onClick={toggleSidebar}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <div className="mt-16">
            <Routes>
              <Route path="/home" element={<DashboardHeader />} />
              <Route path="/manageroles" element={<ManageRoles />} />
              <Route path="/createproduct" element={< CreateProduct />} />
              <Route path="/createproduct/:productId" element={<CreateProduct />} />
              <Route path="/createvarient" element={< CreateVariant />} />
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

            </Routes>
          </div>
        </div>
      </div>
    </div>

  );
};

export default DashboardLayout;