import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Typography, Box, Button, Card, CardContent, CircularProgress } from '@mui/material';
import { logout } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login'); // Redirect to login page after successful logout
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
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
            {/* Add more user info as needed */}
          </CardContent>
        </Card>

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
  );
};

export default EmployeeDashboard;