// Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slice/authSlice'; // Adjust the import path as necessary

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); // Get user from Redux state

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Manager Dashboard
        </Typography>
        <Button color="inherit" onClick={() => navigate('/view-team')}>View Team</Button>
        <Button color="inherit" onClick={() => navigate('/approve-requests')}>Approve Requests</Button>
        {/* User Details */}
        <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 2 }}>
          <Typography variant="body1" sx={{ marginRight: 1 }}>
            {user?.name} ({user?.role})
          </Typography>
        </Box>
        <Button color="inherit" onClick={handleLogout}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;