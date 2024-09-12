import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Typography, Box, Button, Card, CardContent, CircularProgress } from '@mui/material';
import { logout } from '../../store/slice/authSlice';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar'; // Import the Navbar component

const ManagerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Redirect to login if the user is not a manager or not logged in
    if (!loading && (!user || user.role !== 'manager')) {
      navigate('/login'); // Redirect to login page
    }
  }, [loading, user, navigate]); // Depend on loading, user, and navigate

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login'); // Redirect to login page after successful logout
  };

  const handleViewTeam = () => {
    // Assuming department id is available in user.department.id
    const departmentId = user?.department.id;
    if (departmentId) {
      navigate(`/departments/${departmentId}/employees`);
    }
  };

  return (
    <>
      <Navbar /> {/* Include the Navbar component here */}
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
              {/* Add more user info as needed */}
            </CardContent>
          </Card>

          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" component="div" gutterBottom>
              Manager Actions
            </Typography>
            {/* Example Manager Actions */}
            <Button 
              variant="contained" 
              color="secondary" 
              sx={{ mr: 2 }} 
              onClick={handleViewTeam} // Navigate to team view
            >
              View Team
            </Button>
            <Button variant="contained" color="secondary">
              Approve Requests
            </Button>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default ManagerDashboard;