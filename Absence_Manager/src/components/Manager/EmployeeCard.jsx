import React from 'react';
import { Card, CardContent, Typography, Box, FormControl, Select, MenuItem, InputLabel, Chip } from '@mui/material';
import { useDispatch } from 'react-redux';
import { editLeaveRequest } from '../../store/slice/leaveslice/LeaveRequestSlice';

const EmployeeCard = ({ employee, leaveRequests }) => {
    const dispatch = useDispatch();

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

    return (
        <Card sx={{ mb: 2, p: 3, backgroundColor: '#fff', borderRadius: '8px', boxShadow: 3 }}>
            <CardContent>
                <Typography variant="h6">{employee.username}</Typography>
                <Typography variant="body1">Role: {employee.role}</Typography>
                <Typography variant="body1">Leave Requests:</Typography>
                {leaveRequests.map(leave => (
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
    );
};

export default EmployeeCard;