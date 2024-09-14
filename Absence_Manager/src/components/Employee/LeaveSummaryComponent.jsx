import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLeaveSummary, selectLeaveSummary } from '../../store/slice/leaveslice/LeaveSummarySlice';
import { Typography, Card, CardContent, CircularProgress, Grid, Box } from '@mui/material';
import { selectAllEmployees } from '../../store/slice/employeesSlice';

const LeaveSummaryComponent = () => {
  const dispatch = useDispatch();
  const leaveSummary = useSelector(selectLeaveSummary);
  const employees = useSelector(selectAllEmployees);
  const status = useSelector((state) => state.leaveSummary.status);
  const error = useSelector((state) => state.leaveSummary.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchLeaveSummary());
    }
  }, [status, dispatch]);

  // Create a mapping of user IDs to names for easy access
  const employeeMap = employees.reduce((map, employee) => {
    map[employee.id] = employee.username;
    return map;
  }, {});

  return (
    <Card sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: '8px' }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontFamily: 'Roboto, sans-serif', color: '#333' }}>
          Leave Summary
        </Typography>
        {status === 'loading' && <CircularProgress />}
        {status === 'failed' && (
          <Typography variant="body1" sx={{ color: 'red' }}>
            {error}
          </Typography>
        )}
        {status === 'succeeded' && leaveSummary.length > 0 && (
          <Grid container spacing={2}>
            {leaveSummary.map((summary) => (
              <Grid item xs={12} key={summary.user}>
                <Card sx={{ boxShadow: 2, borderRadius: '8px' }}>
                  <CardContent>
                    <Typography variant="h6" component="div" gutterBottom sx={{ fontFamily: 'Roboto, sans-serif', color: '#0077b5' }}>
                      {employeeMap[summary.user] || ``}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#555' }}><strong>Annual Leave:</strong> {summary.annual_leave}</Typography>
                    <Typography variant="body1" sx={{ color: '#555' }}><strong>Sick Leave:</strong> {summary.sick_leave}</Typography>
                    <Typography variant="body1" sx={{ color: '#555' }}><strong>Casual Leave:</strong> {summary.casual_leave}</Typography>
                    <Typography variant="body1" sx={{ color: '#555' }}><strong>Maternity Leave:</strong> {summary.maternity_leave}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaveSummaryComponent;
