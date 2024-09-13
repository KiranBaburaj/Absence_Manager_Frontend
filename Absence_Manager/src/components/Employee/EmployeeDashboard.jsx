import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Typography, Box, Button, Card, CardContent, CircularProgress } from '@mui/material';
import { logout } from '../../store/slice/authSlice';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar'; // Import the Navbar component
import LeaveRequestForm from './LeaveRequestForm'; // Import the LeaveRequestForm component
import LeaveRequestsList from './LeaveRequestsList';

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'employee')) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome, {user?.name}!
          </Typography>
          
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                User Information
              </Typography>
              <Typography variant="body1">Username: {user?.name}</Typography>
              <Typography variant="body1">Email: {user?.email || 'Not provided'}</Typography>
              <Typography variant="body1">Role: {user?.role}</Typography>
              <Typography variant="body1">
                Department: {user?.department.name || 'Not assigned'}
              </Typography>
            </CardContent>
          </Card>
          <LeaveRequestForm /> {/* Include the LeaveRequestForm component here */}
          <LeaveRequestsList/>

          <Box sx={{ mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default EmployeeDashboard;