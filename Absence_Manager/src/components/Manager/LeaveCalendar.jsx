import React from 'react';
import { Box, Typography } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarStyles.css';

const LeaveCalendar = ({ leaveRequests, employees, selectedDate, setSelectedDate }) => {
    // Function to check if a given date is within or before the leave period
    const isDateOnLeave = (date, leave) => {
        const startDate = new Date(leave.start_date);
        const endDate = new Date(leave.end_date);
        // Check if the date is within the leave period or the day before the start date
        const oneDayBeforeStart = new Date(startDate);
        oneDayBeforeStart.setDate(startDate.getDate() - 1);
        return date >= oneDayBeforeStart && date <= endDate;
    };

    // Function to determine the tile class based on leave status
    const tileClassName = ({ date }) => {
        const hasLeave = leaveRequests.some(leave =>
            leave.status === 'approved' && isDateOnLeave(date, leave)
        );
        return hasLeave ? 'approved-leave' : null;
    };

    // Function to determine the content displayed on each tile
    const tileContent = ({ date }) => {
        const leavesOnDate = leaveRequests.filter(leave =>
            leave.status === 'approved' && isDateOnLeave(date, leave)
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
