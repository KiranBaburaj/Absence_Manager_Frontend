import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaveRequests, selectAllLeaveRequests, deleteLeaveRequest } from '../../store/slice/leaveslice/LeaveRequestSlice';
import { Box, Typography, CircularProgress, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const LeaveRequestsList = () => {
    const dispatch = useDispatch();
    const leaveRequests = useSelector(selectAllLeaveRequests);
    const leaveRequestStatus = useSelector((state) => state.leaveRequests.status);
    const leaveRequestError = useSelector((state) => state.leaveRequests.error);

    useEffect(() => {
        if (leaveRequestStatus === 'idle') {
            dispatch(fetchLeaveRequests());
        }
    }, [leaveRequestStatus, dispatch]);

    const handleDelete = async (id) => {
        try {
            // Dispatch the delete action
            await dispatch(deleteLeaveRequest(id)).unwrap();
            // Re-fetch leave requests after deletion
            dispatch(fetchLeaveRequests());
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return '#d4edda'; // Light green
            case 'pending':
                return '#fff3cd'; // Light yellow
            case 'rejected':
                return '#f8d7da'; // Light red
            default:
                return '#ffffff'; // Default white
        }
    };

    const isPastLeave = (endDate) => {
        const today = new Date();
        return new Date(endDate) < today; // Returns true if the leave end date has passed
    };

    return (
        <Box sx={{ mt: 4, p: 3, borderRadius: '8px', backgroundColor: '#ffffff', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontFamily: 'Roboto, sans-serif', color: '#0077b5' }}>
                Leave Requests
            </Typography>
            {leaveRequestStatus === 'loading' && <CircularProgress />}
            {leaveRequestStatus === 'failed' && <Alert severity="error">{leaveRequestError}</Alert>}
            {leaveRequestStatus === 'succeeded' && (
                <List>
                    {leaveRequests.map((request) => (
                        <ListItem 
                            key={request.id} 
                            sx={{ 
                                backgroundColor: getStatusColor(request.status), 
                                mb: 1, 
                                borderRadius: '8px', 
                                p: 2, 
                                boxShadow: 1 // Adds slight shadow for better visual appeal
                            }}
                        >
                            <ListItemText 
                                primary={`${request.leave_type} from ${request.start_date} to ${request.end_date}`} 
                                secondary={
                                    <>
                                        <Typography variant="body2" sx={{ color: '#555' }}>Reason: {request.reason}</Typography>
                                        <Typography 
                                            variant="h6"
                                            sx={{ 
                                                fontWeight: 'bold', 
                                                textTransform: 'capitalize', 
                                                color: '#333',
                                            }}
                                        >
                                            Status: {request.status}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#777' }}>Applied At: {new Date(request.applied_at).toLocaleString()}</Typography>
                                    </>
                                } 
                            />
                            {!isPastLeave(request.end_date) && (
                                <ListItemSecondaryAction>
                                    <IconButton 
                                        edge="end" 
                                        aria-label="delete" 
                                        onClick={() => handleDelete(request.id)} 
                                        disabled={isPastLeave(request.end_date)} 
                                        sx={{ 
                                            '&.Mui-disabled': { 
                                                opacity: 0.5, 
                                            } 
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            )}
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default LeaveRequestsList;