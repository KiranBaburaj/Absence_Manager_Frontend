import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createLeaveRequest } from '../../store/slice/leaveslice/LeaveRequestSlice'; // Adjust the path as necessary
import { TextField, Button, Box, Typography } from '@mui/material';

const LeaveRequestForm = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const leaveRequestError = useSelector((state) => state.leaveRequests.error);
  const leaveRequestStatus = useSelector((state) => state.leaveRequests.status);

  const [leaveType, setLeaveType] = useState('annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [dateError, setDateError] = useState('');
  const [formError, setFormError] = useState(''); // New state for form validation error

  const handleLeaveTypeChange = (e) => {
    setLeaveType(e.target.value);
    setFormError(''); // Clear form error on change
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    setDateError(''); // Clear date error on change
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    setDateError(''); // Clear date error on change
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
    setFormError(''); // Clear form error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (!leaveType || !startDate || !endDate || !reason) {
      setFormError('All fields are required.');
      return;
    } else {
      setFormError(''); // Clear error if validation passes
    }

    // Validate date
    if (new Date(startDate) > new Date(endDate)) {
      setDateError('Start date must be less than or equal to end date.');
      return;
    } else {
      setDateError(''); // Clear error if validation passes
    }

    const leaveData = {
      leave_type: leaveType,
      start_date: startDate,
      end_date: endDate,
      reason,
      user: user.id,
    };

    try {
      await dispatch(createLeaveRequest(leaveData)).unwrap();
      setLeaveType('annual');
      setStartDate('');
      setEndDate('');
      setReason('');
      setFormError(''); // Clear form error on successful submission
      setDateError(''); // Clear date error on successful submission
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Apply for Leave
      </Typography>
      {leaveRequestError && <Typography color="error">{leaveRequestError}</Typography>}
      {formError && <Typography color="error">{formError}</Typography>} {/* Display general form error */}
      {dateError && <Typography color="error">{dateError}</Typography>}
  
      <form onSubmit={handleSubmit}>
        <TextField
          select
          label="Leave Type"
          value={leaveType}
          onChange={handleLeaveTypeChange} // Updated
          sx={{ mb: 2 }}
          fullWidth
          SelectProps={{
            native: true,
          }}
        >
          <option value="annual">Annual Leave</option>
          <option value="sick">Sick Leave</option>
          <option value="casual">Casual Leave</option>
          <option value="maternity">Maternity Leave</option>
        </TextField>

        <TextField
          type="date"
          label="Start Date"
          value={startDate}
          onChange={handleStartDateChange} // Updated
          sx={{ mb: 2 }}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: today,
          }}
        />
        
        <TextField
          type="date"
          label="End Date"
          value={endDate}
          onChange={handleEndDateChange} // Updated
          sx={{ mb: 2 }}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: today,
          }}
        />

        <TextField
          label="Reason"
          value={reason}
          onChange={handleReasonChange} // Updated
          multiline
          rows={4}
          sx={{ mb: 2 }}
          fullWidth
        />

        <Button variant="contained" color="primary" type="submit">
          Submit Leave Request
        </Button>
      </form>
    </Box>
  );
};

export default LeaveRequestForm;