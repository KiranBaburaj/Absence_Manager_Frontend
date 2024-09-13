import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, CircularProgress, Box, Card, CardContent, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { fetchEmployeesByDepartment, selectAllEmployees } from '../../store/slice/employeesSlice';
import { fetchLeaveRequests, selectAllLeaveRequests, editLeaveRequest } from '../../store/slice/leaveslice/LeaveRequestSlice';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarStyles.css';

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

    const [value, setValue] = useState(new Date());
    const [approvedLeaves, setApprovedLeaves] = useState([]);
    const [pendingLeaves, setPendingLeaves] = useState([]);
    const [rejectedLeaves, setRejectedLeaves] = useState([]);

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

    useEffect(() => {
        // Filter leaves based on the selected month
        const filteredApproved = leaveRequests.filter(leave => 
            leave.status === 'approved' &&
            new Date(leave.start_date).getMonth() === value.getMonth() &&
            new Date(leave.start_date).getFullYear() === value.getFullYear()
        );

        const filteredPending = leaveRequests.filter(leave => 
            leave.status === 'pending' &&
            new Date(leave.start_date).getMonth() === value.getMonth() &&
            new Date(leave.start_date).getFullYear() === value.getFullYear()
        );

        const filteredRejected = leaveRequests.filter(leave => 
            leave.status === 'rejected' &&
            new Date(leave.start_date).getMonth() === value.getMonth() &&
            new Date(leave.start_date).getFullYear() === value.getFullYear()
        );

        setApprovedLeaves(filteredApproved);
        setPendingLeaves(filteredPending);
        setRejectedLeaves(filteredRejected);
    }, [leaveRequests, value]);

    const handleStatusChange = (leaveId, newStatus) => {
        const currentLeaveRequest = leaveRequests.find(leave => leave.id === leaveId);

        if (currentLeaveRequest) {
            dispatch(editLeaveRequest({
                leaveRequestId: leaveId,
                leaveRequestData: {
                    user: currentLeaveRequest.user,
                    leave_type: currentLeaveRequest.leave_type,
                    start_date: currentLeaveRequest.start_date,
                    end_date: currentLeaveRequest.end_date,
                    reason: currentLeaveRequest.reason,
                    status: newStatus
                }
            }));
        } else {
            console.error("Leave request not found");
        }
    };

    // Function to add a class name for approved leave days
    const tileClassName = ({ date }) => {
        return approvedLeaves.some(leave => {
            const startDate = new Date(leave.start_date);
            const endDate = new Date(leave.end_date);
            return date >= startDate && date <= endDate;
        }) ? 'approved-leave' : null;
    };

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
            <Container maxWidth="md">
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Employees in Department {departmentName || 'N/A'}
                    </Typography>
                    
                    {/* Calendar Component */}
                    <Calendar
                        onChange={setValue}
                        value={value}
                        tileClassName={tileClassName} 
                    />

                    <Typography variant="h5" sx={{ mt: 3 }}>
                        Leave Requests for {value.toLocaleString('default', { month: 'long', year: 'numeric' })}:
                    </Typography>

                    {/* Approved Leaves Section */}
                    <Card sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6">Approved Leaves</Typography>
                            {approvedLeaves.length > 0 ? approvedLeaves.map((leave) => (
                                <Typography key={leave.id} variant="body2">
                                    {leave.leave_type} from {leave.start_date} to {leave.end_date} (Status: {leave.status})
                                </Typography>
                            )) : (
                                <Typography variant="body2">No approved leaves for this month.</Typography>
                            )}
                        </CardContent>
                    </Card>

                    {/* Pending Leaves Section */}
                    <Card sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6">Pending Leaves</Typography>
                            {pendingLeaves.length > 0 ? pendingLeaves.map((leave) => (
                                <Box key={leave.id} sx={{ mb: 1 }}>
                                    <Typography variant="body2">
                                        {leave.leave_type} from {leave.start_date} to {leave.end_date} (Status: {leave.status})
                                    </Typography>
                                    <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                                        <InputLabel id={`status-label-${leave.id}`}>Change Status</InputLabel>
                                        <Select
                                            labelId={`status-label-${leave.id}`}
                                            value={leave.status}
                                            onChange={(e) => handleStatusChange(leave.id, e.target.value)}
                                        >
                                            <MenuItem value="pending">Pending</MenuItem>
                                            <MenuItem value="approved">Approve</MenuItem>
                                            <MenuItem value="rejected">Reject</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            )) : (
                                <Typography variant="body2">No pending leaves for this month.</Typography>
                            )}
                        </CardContent>
                    </Card>

                    {/* Rejected Leaves Section */}
                    <Card sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6">Rejected Leaves</Typography>
                            {rejectedLeaves.length > 0 ? rejectedLeaves.map((leave) => (
                                <Typography key={leave.id} variant="body2">
                                    {leave.leave_type} from {leave.start_date} to {leave.end_date} (Status: {leave.status})
                                </Typography>
                            )) : (
                                <Typography variant="body2">No rejected leaves for this month.</Typography>
                            )}
                        </CardContent>
                    </Card>

                    {/* Employees Section */}
                    {employees.map((employee) => (
                        <Card key={employee.id} sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6">{employee.username}</Typography>
                                <Typography variant="body1">Role: {employee.role}</Typography>
                                <Typography variant="body1">Approved: {employee.is_approved ? 'Yes' : 'No'}</Typography>
                                <Typography variant="body1">Leave Requests:</Typography>
                                {leaveRequests
                                    .filter(leave => leave.user === employee.id)
                                    .map(leave => (
                                        <Box key={leave.id} sx={{ mb: 1 }}>
                                            <Typography variant="body2">
                                                {leave.leave_type} from {leave.start_date} to {leave.end_date} (Status: {leave.status})
                                            </Typography>
                                            <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                                                <InputLabel id={`status-label-${leave.id}`}>Change Status</InputLabel>
                                                <Select
                                                    labelId={`status-label-${leave.id}`}
                                                    value={leave.status}
                                                    onChange={(e) => handleStatusChange(leave.id, e.target.value)}
                                                >
                                                    <MenuItem value="pending">Pending</MenuItem>
                                                    <MenuItem value="approved">Approved</MenuItem>
                                                    <MenuItem value="rejected">Rejected</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    )) || <Typography variant="body2">No leave requests</Typography>}
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Container>
        </>
    );
};

export default EmployeesByDepartment;