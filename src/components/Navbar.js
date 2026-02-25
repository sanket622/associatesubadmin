import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, setCredentials, fetchAllModules, setFilteredModules, setAllModules } from './auth/redux/auth/authSlice';
import { Avatar, Menu, MenuItem, IconButton, Box } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import logo from '../assets/AppIcons.svg';


const notifications = [
  {
    id: 1,
    title: 'New Loan Assigned',
    desc: 'Loan LN-123 has been assigned to you',
    time: '2 min ago',
  },
  {
    id: 2,
    title: 'KYC Approved',
    desc: 'Customer KYC has been approved',
    time: '1 hour ago',
  },
  {
    id: 3,
    title: 'Recheck Required',
    desc: 'Loan LN-456 needs recheck',
    time: 'Yesterday',
  },
];


function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const user = useSelector((state) => state.auth.user);
  // const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const notifOpen = Boolean(notifAnchorEl);
  const menulog = Boolean(anchorEl);
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
    const modulesRaw = localStorage.getItem('modules');


    const isValid = isTokenValid(token);
    if (!token || !refreshToken || !userRaw || !isValid) {
      dispatch(logout());
      navigate('/login', { replace: true });
    } else {
      if (!accessToken) {
        const user = JSON.parse(userRaw);
        dispatch(setCredentials({ user, accessToken: token, refreshToken }));

        if (modulesRaw) {
          const modules = JSON.parse(modulesRaw);
          dispatch(setAllModules(modules));
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
    <div className="bg-brand w-full shadow-md fixed top-0 left-0 h-[70px] flex items-center px-6 z-[2000]">
      <div className="flex justify-between items-center w-full px-6">
        <img src={logo} alt="logo" className="h-14 object-contain" />

        <Box className="flex items-center gap-8">

          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setAnchorEl(null);
              setNotifAnchorEl(e.currentTarget);
            }}
          >
            <Badge badgeContent={notifications?.length} color="error">
              <NotificationsNoneIcon sx={{ fontSize: 26, color: '#084E77' }} />
            </Badge>
          </IconButton>


          <Box
            className="flex items-center cursor-pointer"
            onClick={(e) => {
              setNotifAnchorEl(null);
              setAnchorEl(e.currentTarget);
            }}
          >
            <Avatar
              sx={{
                bgcolor: 'var(--theme-btn-bg)',
                width: 35,
                height: 35,
              }}
            >
              <PersonIcon />
            </Avatar>

            <span className="ml-2 font-semibold text-gray-800">
              {user?.name}
            </span>

            <ArrowDropDownIcon className="text-blue-600" />
          </Box>
        </Box>


        <Menu
          anchorEl={anchorEl}
          open={menulog}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{
            sx: {
              mt: 1,
              width: 160,
              borderRadius: '10px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
              p: 0,
            },
          }}
          MenuListProps={{
            sx: {
              p: 0,
            },
          }}
        >
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              setNotifAnchorEl(null);
              handleLogout();
            }}
            sx={{
              gap: 1.5,
              mx: 1,
              my: 0.5,
              borderRadius: '6px',
              color: 'var(--theme-btn-bg)',
              '&:hover': {
                backgroundColor: 'var(--theme-btn-bg)',
                color: '#fff',
              },
            }}
          >
            <LogoutIcon fontSize="small" />
            Logout
          </MenuItem>
        </Menu>
        <Menu
          anchorEl={notifAnchorEl}
          open={notifOpen}
          onClose={() => setNotifAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{
            sx: {
              mt: 1,
              width: 320,
              borderRadius: '12px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
              p: 0,
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <strong>Notifications</strong>
          </Box>

          <Divider />

          {notifications?.map((n) => (
            <MenuItem
              key={n.id}
              sx={{
                alignItems: 'flex-start',
                gap: 1,
                py: 1.2,
                whiteSpace: 'normal',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)',
                },
              }}
            >
              <Box>
                <Box sx={{ fontWeight: 600, fontSize: 14 }}>{n.title}</Box>
                <Box sx={{ fontSize: 13, color: '#666' }}>{n.desc}</Box>
                <Box sx={{ fontSize: 11, color: '#999', mt: 0.5 }}>{n.time}</Box>
              </Box>
            </MenuItem>
          ))}

          {notifications?.length === 0 && (
            <Box sx={{ p: 2, textAlign: 'center', color: '#777' }}>
              No notifications
            </Box>
          )}
        </Menu>



      </div>
    </div>
  );
}

export default Navbar;
