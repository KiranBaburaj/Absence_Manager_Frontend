import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slice/authSlice'; // Adjust the import path as necessary

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const NavButton = ({ onClick, children }) => (
    <Button
      color="inherit"
      onClick={onClick}
      sx={{
        fontFamily: 'Roboto, sans-serif',
        textTransform: 'none',
        marginRight: { xs: 0, sm: 2 },
        display: { xs: 'none', sm: 'block' }
      }}
    >
      {children}
    </Button>
  );

  const NavMenuItem = ({ onClick, children }) => (
    <MenuItem
      onClick={() => {
        onClick();
        handleMenuClose();
      }}
      sx={{ fontFamily: 'Roboto, sans-serif' }}
    >
      {children}
    </MenuItem>
  );

  return (
    <AppBar position="static" sx={{ backgroundColor: '#0077b5', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, fontFamily: 'Roboto, sans-serif', color: '#fff' }}
        >
          My Application
        </Typography>

        {/* Desktop Menu */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
          {user?.role === 'employee' && (
            <>
              <NavButton onClick={() => navigate('/EmployeeDashboard')}>
                Employee Dashboard
              </NavButton>
              <NavButton onClick={() => navigate('/EmployeeLeave')}>
                Apply Leave
              </NavButton>
            </>
          )}

          {user?.role === 'manager' && (
            <>
              <NavButton onClick={() => navigate('/ManagerDashboard')}>
                Manager Dashboard
              </NavButton>
              {user?.department?.id && (
                <NavButton onClick={() => navigate(`/departments/${user.department.id}/employees`)}>
                  View Employees
                </NavButton>
              )}
              <NavButton onClick={() => {
                const departmentId = user?.department?.id;
                if (departmentId) {
                  navigate(`/LeaveManagement/${departmentId}/employees`);
                }
              }}>
                Approve Requests
              </NavButton>
            </>
          )}
        </Box>

        {/* User Details and Logout Button */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', marginLeft: 2 }}>
          <Typography
            variant="body1"
            sx={{ marginRight: 1, fontFamily: 'Roboto, sans-serif', color: '#fff' }}
          >
            {user?.name} ({user?.role})
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            sx={{ fontFamily: 'Roboto, sans-serif', textTransform: 'none' }}
          >
            Logout
          </Button>
        </Box>

        {/* Mobile Menu */}
        <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem sx={{ fontFamily: 'Roboto, sans-serif' }}>
              {user?.name} ({user?.role})
            </MenuItem>
            {user?.role === 'employee' && (
              <>
                <NavMenuItem onClick={() => navigate('/EmployeeDashboard')}>
                  Employee Dashboard
                </NavMenuItem>
                <NavMenuItem onClick={() => navigate('/EmployeeLeave')}>
                  Apply Leave
                </NavMenuItem>
              </>
            )}
            {user?.role === 'manager' && (
              <>
                <NavMenuItem onClick={() => navigate('/ManagerDashboard')}>
                  Manager Dashboard
                </NavMenuItem>
                {user?.department?.id && (
                  <NavMenuItem onClick={() => navigate(`/departments/${user.department.id}/employees`)}>
                    View Employees
                  </NavMenuItem>
                )}
                <NavMenuItem onClick={() => {
                  const departmentId = user?.department?.id;
                  if (departmentId) {
                    navigate(`/LeaveManagement/${departmentId}/employees`);
                  }
                }}>
                  Approve Requests
                </NavMenuItem>
              </>
            )}
            <NavMenuItem onClick={handleLogout}>Logout</NavMenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;