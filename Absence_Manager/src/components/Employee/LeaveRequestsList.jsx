import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaveRequests, selectAllLeaveRequests, deleteLeaveRequest } from '../../store/slice/leaveslice/LeaveRequestSlice'; // Adjust the path as necessary
import { Box, Typography, CircularProgress, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
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
            // Optionally, handle the error with a notification to the user
        }
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                Leave Requests
            </Typography>
            {leaveRequestStatus === 'loading' && <CircularProgress />}
            {leaveRequestStatus === 'failed' && <Typography color="error">{leaveRequestError}</Typography>}
            {leaveRequestStatus === 'succeeded' && (
                <List>
                    {leaveRequests.map((request) => (
                        <ListItem key={request.id}>
                            <ListItemText 
                                primary={`${request.leave_type} from ${request.start_date} to ${request.end_date}`} 
                                secondary={
                                    <>
                                        <Typography variant="body2">Reason: {request.reason}</Typography>
                                        <Typography variant="body2">Status: {request.status}</Typography>
                                        <Typography variant="body2">Applied At: {new Date(request.applied_at).toLocaleString()}</Typography>
                                        <Typography variant="body2">User ID: {request.user}</Typography>
                                    </>
                                } 
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(request.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default LeaveRequestsList;