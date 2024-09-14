import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Typography, Box, CircularProgress, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar'; 
import LeaveSummaryComponent from './LeaveSummaryComponent';

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'employee')) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

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
      <Container maxWidth="lg" sx={{ mt: 4, backgroundColor: '#f4f4f4', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', p: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontFamily: 'Roboto, sans-serif', color: '#0077b5' }}>
            Welcome, {user?.name}!
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, boxShadow: 3, borderRadius: '8px', backgroundColor: '#fff' }}>
              <Typography variant="h5" component="div" gutterBottom sx={{ fontFamily: 'Roboto, sans-serif', color: '#333' }}>
                User Information
              </Typography>
              <Typography variant="body1" sx={{ color: '#555' }}><strong>Username:</strong> {user?.name}</Typography>
              <Typography variant="body1" sx={{ color: '#555' }}><strong>Email:</strong> {user?.email || 'Not provided'}</Typography>
              <Typography variant="body1" sx={{ color: '#555' }}><strong>Role:</strong> {user?.role}</Typography>
              <Typography variant="body1" sx={{ color: '#555' }}><strong>Department:</strong> {user?.department.name || 'Not assigned'}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, backgroundColor: '#fff', borderRadius: '8px' }}>
              <LeaveSummaryComponent />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default EmployeeDashboard;
