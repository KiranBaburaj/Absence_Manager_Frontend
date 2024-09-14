import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Container, Typography, Box, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import Navbar from '../Navbar'; 
import LeaveRequestForm from './LeaveRequestForm'; 
import LeaveRequestsList from './LeaveRequestsList';
import { useNavigate } from 'react-router-dom';

const Leaveapplypage = () => {
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
    <div>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, backgroundColor: '#f4f4f4', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', p: 3 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontFamily: 'Roboto, sans-serif', color: '#0077b5' }}>
          Apply for Leave
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, boxShadow: 3, borderRadius: '8px' }}>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom sx={{ fontFamily: 'Roboto, sans-serif', color: '#333' }}>
                  Leave Request Form
                </Typography>
                <LeaveRequestForm /> {/* Leave request form section */}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, boxShadow: 3, borderRadius: '8px' }}>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom sx={{ fontFamily: 'Roboto, sans-serif', color: '#333' }}>
                  Your Leave Requests
                </Typography>
                <LeaveRequestsList /> {/* Leave requests list section */}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Leaveapplypage;
