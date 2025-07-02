import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, setCredentials, fetchAllModules, setFilteredModules } from './auth/redux/auth/authSlice';

import logo from '../assets/earnlogo.png';
import { Avatar, IconButton } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import LogoutIcon from '@mui/icons-material/Logout';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [menuOpen, setMenuOpen] = useState(false);

  const isTokenValid = (token) => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.exp) return false;
      const now = Date.now() / 1000;

      return payload.exp > now;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userRaw = localStorage.getItem('user');
    const filteredModulesRaw = localStorage.getItem('filteredModules');


    const isValid = isTokenValid(token);
    if (!token || !refreshToken || !userRaw || !isValid) {
      dispatch(logout());
      navigate('/login', { replace: true });
    } else {
      if (!accessToken) {
        const user = JSON.parse(userRaw);
        dispatch(setCredentials({ user, accessToken: token, refreshToken }));

        if (filteredModulesRaw) {
          const filteredModules = JSON.parse(filteredModulesRaw);
          dispatch(setFilteredModules(filteredModules));
        } else {
          dispatch(fetchAllModules());
        }

        if (window.location.pathname === '/login') {
          navigate('/home', { replace: true });
        }
      }
    }
  }, [dispatch, accessToken, navigate]);


  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <div className="bg-white w-full shadow-md fixed z-50">
      <div className="flex justify-between items-center w-full px-4 py-2">
        <img src={logo} alt="logo" className="h-14" />
        <div className="relative">
          <div className="flex items-center cursor-pointer" onClick={() => setMenuOpen((prev) => !prev)}>
            <Avatar
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
              alt="Main Admin"
              className="h-10 w-10"
            />
            <span className="ml-2 font-semibold text-gray-800">Abhiraj</span>
            <ArrowDropDownIcon className="text-blue-600" />
          </div>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg">
              <div
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={handleLogout}
              >
                <LogoutIcon className="text-gray-700" />
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
