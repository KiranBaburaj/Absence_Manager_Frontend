import React from 'react';
import { Box, Typography } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarStyles.css';

const LeaveCalendar = ({ leaveRequests, employees, selectedDate, setSelectedDate }) => {
    const tileClassName = ({ date }) => {
        return leaveRequests.some(leave => 
            leave.status === 'approved' &&
            date >= new Date(leave.start_date) &&
            date <= new Date(leave.end_date)
        ) ? 'approved-leave' : null;
    };

    const tileContent = ({ date }) => {
        const leavesOnDate = leaveRequests.filter(leave => 
            leave.status === 'approved' &&
            date >= new Date(leave.start_date) &&
            date <= new Date(leave.end_date)
        );

        if (leavesOnDate.length > 0) {
            return (
                <Box sx={{ textAlign: 'center', color: 'blue' }}>
                    {leavesOnDate.map((leave) => {
                        const employee = employees.find(emp => emp.id === leave.user);
                        return employee ? (
                            <Typography variant="caption" key={leave.id}>
                                {employee.username} - {leave.leave_type}
                            </Typography>
                        ) : null;
                    })}
                </Box>
            );
        }
        return null;
    };

    return (
        <Box sx={{ mb: 4 }}>
            <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileClassName={tileClassName}
                tileContent={tileContent}
            />

        </Box>
    );
};

export default LeaveCalendar;