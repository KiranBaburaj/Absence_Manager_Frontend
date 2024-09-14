import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, CircularProgress, Box, Grid } from '@mui/material';
import { fetchEmployeesByDepartment, selectAllEmployees } from '../../store/slice/employeesSlice';
import { fetchLeaveRequests, selectAllLeaveRequests } from '../../store/slice/leaveslice/LeaveRequestSlice';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import LeaveCalendar from './LeaveCalendar';
import EmployeeCard from './EmployeeCard';
import LeaveSummaryComponent from '../Employee/LeaveSummaryComponent';

const EmployeesByDepartment = () => {
    const { departmentId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const employees = useSelector(selectAllEmployees);
    const leaveRequests = useSelector(selectAllLeaveRequests);
    const status = useSelector((state) => state.employees.status);
    const error = useSelector((state) => state.employees.error);
    const user = useSelector((state) => state.auth.user);
    const departmentName = user?.department.name;

    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        if (!user || user.role !== 'manager') {
            navigate('/login');
        }
    }, [user, navigate]);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchEmployeesByDepartment(departmentId));
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
                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h3" component="h1" gutterBottom sx={{ fontFamily: 'Roboto, sans-serif', color: '#0077b5' }}>
                                Employees in  {departmentName || 'N/A'}
                            </Typography>
                        </Box>
                        {employees.map((employee) => (
                            <EmployeeCard
                                key={employee.id}
                                employee={employee}
                                leaveRequests={leaveRequests.filter(leave => leave.user === employee.id)}
                            />
                        ))}
                    </Grid>

                    <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <LeaveCalendar
                            leaveRequests={leaveRequests}
                            employees={employees}
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                        />
                    </Grid>
                </Grid>

                <LeaveSummaryComponent />
            </Container>
        </>
    );
};

export default EmployeesByDepartment;
