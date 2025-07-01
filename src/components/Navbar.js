import * as React from 'react';
import logo from '../assets/earnlogo.png';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Avatar, IconButton } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PersonIcon from '@mui/icons-material/Person';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupsIcon from '@mui/icons-material/Groups';
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import { useDispatch } from 'react-redux';
import { logout } from './auth/redux/auth/authSlice';



function Navbar() {

  const [language, setLanguage] = React.useState('en');
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();


  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const handleClick = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleClose = () => {
    setMenuOpen(false);
  };

  const dispatch = useDispatch();

  const handleMenuItemClick = (setting) => {
    switch (setting) {
      case 'Logout':
        dispatch(logout());
        navigate('/login', { replace: true });
        break;
      default:
        break;
    }
    handleClose();
  };

  const BellIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-black"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );


  return (
    <div className="bg-white w-full shadow-md fixed" style={{ zIndex: 9 }}>
      <div className="flex justify-between items-center  w-full">
        <div className="flex items-center cursor-pointer" onClick={toggleLanguage}>
          <img
            src={logo}
            alt=""
            className="w-[135px] ml-4"
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative mr-2">
            <IconButton className="p-2">
              <BellIcon />
              {/* Red notification dot */}
              <span className="absolute top-1 right-2 bg-red-500 rounded-full h-2 w-2"></span>
            </IconButton>
          </div>
          {/* Profile dropdown */}
          <div className="relative">
            <div
              className="flex items-center cursor-pointer py-4 mr-6"
              onClick={handleClick}
            >
              {/* Profile Avatar */}
              <Avatar
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                alt="Main Admin"
                className="h-12 w-12 mr-3"
              />

              {/* Admin Text */}
              <span className="text-black font-semibold text-xl mr-0">
                Abhiraj
              </span>

              {/* Dropdown Arrow */}
              <ArrowDropDownIcon className="text-[#0000FF] h-8 w-8" />
            </div>

            {menuOpen && (
              <div className="absolute top-16 right-2 w-40 bg-white rounded-lg shadow-lg border z-50 mr-4">
                {/* Triangle Pointer */}
                <div className="absolute -top-2 right-12 w-4 h-4 bg-white rotate-45 border-t border-l border-gray-200 z-10"></div>

                {/* Menu Items */}
               
                <div
                  onClick={() => handleMenuItemClick('Logout')}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer"
                >
                  <LogoutIcon className="text-gray-700" />
                  <span className="text-sm text-gray-800">Logout</span>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Navbar;
