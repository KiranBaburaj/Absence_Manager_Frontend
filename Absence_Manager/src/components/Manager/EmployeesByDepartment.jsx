import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, CircularProgress, Box, Card, CardContent, FormControl, Select, MenuItem, InputLabel, Chip } from '@mui/material';
import { fetchEmployeesByDepartment, selectAllEmployees } from '../../store/slice/employeesSlice';
import { fetchLeaveRequests, selectAllLeaveRequests, editLeaveRequest } from '../../store/slice/leaveslice/LeaveRequestSlice';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarStyles.css';
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
        const filterLeaves = (leaveStatus) => leaveRequests.filter(leave =>
            leave.status === leaveStatus &&
            new Date(leave.start_date).getMonth() === value.getMonth() &&
            new Date(leave.start_date).getFullYear() === value.getFullYear()
        );
        setApprovedLeaves(filterLeaves('approved'));
        setPendingLeaves(filterLeaves('pending'));
        setRejectedLeaves(filterLeaves('rejected'));
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

    const leaveStatusChip = (status) => {
        let color;
        switch (status) {
            case 'approved':
                color = 'success';
                break;
            case 'pending':
                color = 'warning';
                break;
            case 'rejected':
                color = 'error';
                break;
            default:
                color = 'default';
        }
        return <Chip label={status} color={color} />;
    };

    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4, backgroundColor: '#f4f4f4', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', p: 3 }}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h3" component="h1" gutterBottom sx={{ fontFamily: 'Roboto, sans-serif', color: '#0077b5' }}>
                        Employees in Department {departmentName || 'N/A'}
                    </Typography>
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Calendar onChange={setValue} value={value} tileClassName={tileClassName} />
                    <Typography variant="h5" sx={{ mt: 3, fontFamily: 'Roboto, sans-serif', color: '#0077b5' }}>
                        Leave Requests for {value.toLocaleString('default', { month: 'long', year: 'numeric' })}:
                    </Typography>
                </Box>

                {/* Approved Leaves */}
                <Card sx={{ mb: 2, p: 3, backgroundColor: '#fff', borderRadius: '8px', boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6">Approved Leaves</Typography>
                        {approvedLeaves.length > 0 ? approvedLeaves.map((leave) => (
                            <Typography key={leave.id} variant="body2">
                                {leave.leave_type} from {leave.start_date} to {leave.end_date} {leaveStatusChip(leave.status)}
                            </Typography>
                        )) : (
                            <Typography variant="body2">No approved leaves for this month.</Typography>
                        )}
                    </CardContent>
                </Card>

                {/* Pending Leaves */}
                <Card sx={{ mb: 2, p: 3, backgroundColor: '#fff', borderRadius: '8px', boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6">Pending Leaves</Typography>
                        {pendingLeaves.length > 0 ? pendingLeaves.map((leave) => (
                            <Box key={leave.id} sx={{ mb: 1 }}>
                                <Typography variant="body2">
                                    {leave.leave_type} from {leave.start_date} to {leave.end_date} {leaveStatusChip(leave.status)}
                                </Typography>
                                <FormControl variant="outlined" sx={{ minWidth: 120, mt: 1 }}>
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

                {/* Rejected Leaves */}
                <Card sx={{ mb: 2, p: 3, backgroundColor: '#fff', borderRadius: '8px', boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6">Rejected Leaves</Typography>
                        {rejectedLeaves.length > 0 ? rejectedLeaves.map((leave) => (
                            <Typography key={leave.id} variant="body2">
                                {leave.leave_type} from {leave.start_date} to {leave.end_date} {leaveStatusChip(leave.status)}
                            </Typography>
                        )) : (
                            <Typography variant="body2">No rejected leaves for this month.</Typography>
                        )}
                    </CardContent>
                </Card>
                <LeaveSummaryComponent/>

                {/* Employees Section */}
                {employees.map((employee) => (
                    <Card key={employee.id} sx={{ mb: 2, p: 3, backgroundColor: '#fff', borderRadius: '8px', boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6">{employee.username}</Typography>
                            <Typography variant="body1">Role: {employee.role}</Typography>
                            <Typography variant="body1">Leave Requests:</Typography>
                            {leaveRequests.filter(leave => leave.user === employee.id).map(leave => (
                                <Box key={leave.id} sx={{ mb: 1 }}>
                                    <Typography variant="body2">
                                        {leave.leave_type} from {leave.start_date} to {leave.end_date} {leaveStatusChip(leave.status)}
                                    </Typography>
                                    <FormControl variant="outlined" sx={{ minWidth: 120, mt: 1 }}>
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
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </Container>
        </>
    );
};

export default EmployeesByDepartment;
