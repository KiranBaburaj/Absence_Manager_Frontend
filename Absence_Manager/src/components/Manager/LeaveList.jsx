import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, FormControl, Select, MenuItem, InputLabel, Chip, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { editLeaveRequest } from '../../store/slice/leaveslice/LeaveRequestSlice';

const LeaveList = ({ leaveRequests, employees }) => {
    const dispatch = useDispatch();
    const [selectedDate, setSelectedDate] = useState(new Date()); // Initialize with the current date

    // Function to change the month based on the increment value (-1 for previous, +1 for next)
    const changeMonth = (increment) => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(selectedDate.getMonth() + increment);
        setSelectedDate(newDate);
    };

    // Separate function to filter leaves by month and year for approved and rejected
    const filterLeavesByDate = (status) => leaveRequests.filter(leave =>
        leave.status === status &&
        new Date(leave.start_date).getMonth() === selectedDate.getMonth() &&
        new Date(leave.start_date).getFullYear() === selectedDate.getFullYear()
    );

    // All pending leaves irrespective of the selected date
    const pendingLeaves = leaveRequests.filter(leave => leave.status === 'pending');
    const approvedLeaves = filterLeavesByDate('approved');
    const rejectedLeaves = filterLeavesByDate('rejected');

    const handleStatusChange = (leaveId, newStatus) => {
        const currentLeaveRequest = leaveRequests.find(leave => leave.id === leaveId);
        if (currentLeaveRequest) {
            dispatch(editLeaveRequest({
                leaveRequestId: leaveId,
                leaveRequestData: { ...currentLeaveRequest, status: newStatus }
            }));
        } else {
            console.error("Leave request not found");
        }
    };

    const leaveStatusChip = (status) => {
        const color = status === 'approved' ? 'success' : status === 'pending' ? 'warning' : 'error';
        return <Chip label={status} color={color} />;
    };

    const LeaveCard = ({ title, leaves }) => (
        <Card sx={{ mb: 2, p: 3, backgroundColor: '#fff', borderRadius: '8px', boxShadow: 3 }}>
            <CardContent>
                <Typography variant="h6">{title}</Typography>
                {leaves.length > 0 ? leaves.map((leave) => {
                    const employee = employees.find(emp => emp.id === leave.user);
                    return (
                        <Box key={leave.id} sx={{ mb: 1 }}>
                            <Typography variant="body2">
                                {employee ? `${employee.username} - ` : ''}{leave.leave_type} from {leave.start_date} to {leave.end_date} {leaveStatusChip(leave.status)}
                            </Typography>
                            {leave.status === 'pending' && (
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
                            )}
                        </Box>
                    );
                }) : (
                    <Typography variant="body2">No {title.toLowerCase()} requests for this month.</Typography>
                )}
            </CardContent>
        </Card>
    );

    return (
        <>
        
            {/* Display Pending Leaves (irrespective of date) */}
            <LeaveCard title="Pending Leaves " leaves={pendingLeaves} />

            {/* Buttons to navigate between months */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="outlined" onClick={() => changeMonth(-1)}>
                    Previous Month
                </Button>
                <Typography variant="h6">{selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</Typography>
                <Button variant="outlined" onClick={() => changeMonth(1)}>
                    Next Month
                </Button>
            </Box>


            {/* Display Approved and Rejected Leaves based on selected date */}
            <LeaveCard title="Approved Leaves" leaves={approvedLeaves} />
            <LeaveCard title="Rejected Leaves" leaves={rejectedLeaves} />
        </>
    );
};

export default LeaveList;
