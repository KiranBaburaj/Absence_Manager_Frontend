import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Grid, Box, Typography, CircularProgress } from '@mui/material';
import { fetchEmployeesByDepartment, selectAllEmployees } from '../../store/slice/employeesSlice'; // Adjust import path as needed
import { fetchLeaveRequests, selectAllLeaveRequests } from '../../store/slice/leaveslice/LeaveRequestSlice'; // Adjust import path as needed
import LeaveCalendar from './LeaveCalendar';
import LeaveList from './LeaveList';
import Navbar from '../Navbar';
import { useParams } from 'react-router-dom';

const LeaveManagement = () => {
  const { departmentId } = useParams(); // Get departmentId from URL params
  const dispatch = useDispatch();
  const employees = useSelector(selectAllEmployees);
  const leaveRequests = useSelector(selectAllLeaveRequests);
  const status = useSelector((state) => state.employees.status);
  const error = useSelector((state) => state.employees.error);

  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchEmployeesByDepartment(departmentId)); // Fetch employees by departmentId
      dispatch(fetchLeaveRequests());
    }
  }, [departmentId, dispatch, status]);

  if (status === 'loading') {
    return (
      <>
        <Navbar />
        <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Container>
      </>
    );
  }

  if (status === 'failed') {
    return (
      <>
        <Navbar />
        <Container>
          <Typography variant="h6" color="error">Error: {error}</Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, backgroundColor: '#f4f4f4', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', p: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontFamily: 'Roboto, sans-serif', color: '#0077b5' }}>
            Leave Management 
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <LeaveList
              leaveRequests={leaveRequests}
              employees={employees}
              selectedDate={selectedDate}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <LeaveCalendar
              leaveRequests={leaveRequests}
              employees={employees}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default LeaveManagement;
