import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createLeaveRequest } from '../../store/slice/leaveslice/LeaveRequestSlice';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';

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
  const [formError, setFormError] = useState('');

  const handleLeaveTypeChange = (e) => {
    setLeaveType(e.target.value);
    setFormError('');
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    setDateError('');
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    setDateError('');
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!leaveType || !startDate || !endDate || !reason) {
      setFormError('All fields are required.');
      return;
    } else {
      setFormError('');
    }

    if (new Date(startDate) > new Date(endDate)) {
      setDateError('Start date must be less than or equal to end date.');
      return;
    } else {
      setDateError('');
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
      setFormError('');
      setDateError('');
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Box sx={{ mt: 4, p: 3, borderRadius: '8px', backgroundColor: '#ffffff', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontFamily: 'Roboto, sans-serif', color: '#0077b5' }}>
        Apply for Leave
      </Typography>
      {leaveRequestError && <Alert severity="error">{leaveRequestError}</Alert>}
      {formError && <Alert severity="error">{formError}</Alert>}
      {dateError && <Alert severity="error">{dateError}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          select
          label="Leave Type"
          value={leaveType}
          onChange={handleLeaveTypeChange}
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
          onChange={handleStartDateChange}
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
          onChange={handleEndDateChange}
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
          onChange={handleReasonChange}
          multiline
          rows={4}
          sx={{ mb: 2 }}
          fullWidth
        />

        <Button variant="contained" color="primary" type="submit" sx={{ backgroundColor: '#0077b5', '&:hover': { backgroundColor: '#005582' } }}>
          Submit Leave Request
        </Button>
      </form>
    </Box>
  );
};

export default LeaveRequestForm;