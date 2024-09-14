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
      <>
        <Navbar />
        <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Container>
      </>
    );
  }



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
      <Container maxWidth="lg" sx={{ mt: 4, backgroundColor: '#f4f4f4', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', p: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontFamily: 'Roboto, sans-serif', color: '#0077b5' }}>
            Welcome, {user?.name}!
          </Typography>
        </Box>

        <Card sx={{ mb: 4 }}>
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

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" component="div" gutterBottom sx={{ fontFamily: 'Roboto, sans-serif', color: '#0077b5' }}>
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
          <Button   onClick={() => navigate(`/LeaveManagement/${user.department.id}/employees`)}  variant="contained" color="secondary">
            Approve Requests
          </Button>
        </Box>


      </Container>
    </>
  );
};

export default ManagerDashboard;
