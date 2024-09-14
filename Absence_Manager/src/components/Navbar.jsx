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
    <AppBar position="static" sx={{ backgroundColor: '#0077b5', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          sx={{ flexGrow: 1, fontFamily: 'Roboto, sans-serif', color: '#fff' }}
        >
          My Application
        </Typography>

        {/* Conditionally Render Buttons Based on User Role */}
        {user?.role === 'employee' && (
          <>
            <Button 
              color="inherit" 
              onClick={() => navigate('/EmployeeDashboard')} 
              sx={{ fontFamily: 'Roboto, sans-serif', textTransform: 'none', marginRight: 2 }}
            >
              Employee Dashboard
            </Button>
            <Button 
              color="inherit" 
              onClick={() => navigate('/EmployeeLeave')} 
              sx={{ fontFamily: 'Roboto, sans-serif', textTransform: 'none', marginRight: 2 }}
            >
              Apply Leave
            </Button>
          </>
        )}

        {user?.role === 'manager' && (
          <>
            <Button 
              color="inherit" 
              onClick={() => navigate('/ManagerDashboard')} 
              sx={{ fontFamily: 'Roboto, sans-serif', textTransform: 'none', marginRight: 2 }}
            >
              Manager Dashboard
            </Button>
            {user?.department?.id && (
              <Button 
                color="inherit" 
                onClick={() => navigate(`/departments/${user.department.id}/employees`)} 
                sx={{ fontFamily: 'Roboto, sans-serif', textTransform: 'none', marginRight: 2 }}
              >
                View  Employees
              </Button>
            )}
            <Button 
              color="inherit" 
              onClick={        () => {
                // Assuming department id is available in user.department.id
                const departmentId = user?.department.id;
                if (departmentId) {
                  navigate(`/LeaveManagement/${departmentId}/employees`);
                }
              }}
              sx={{ fontFamily: 'Roboto, sans-serif', textTransform: 'none', marginRight: 2 }}
            >
              Approve Requests
            </Button>
          </>
        )}

        {/* User Details */}
        <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 2 }}>
          <Typography 
            variant="body1" 
            sx={{ marginRight: 1, fontFamily: 'Roboto, sans-serif', color: '#fff' }}
          >
            {user?.name} ({user?.role})
          </Typography>
        </Box>

        <Button 
          color="inherit" 
          onClick={handleLogout} 
          sx={{ fontFamily: 'Roboto, sans-serif', textTransform: 'none' }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
