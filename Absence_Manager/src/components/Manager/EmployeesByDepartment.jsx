import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, CircularProgress, Box } from '@mui/material';
import { fetchEmployeesByDepartment, selectAllEmployees } from '../../store/slice/employeesSlice'; // Adjust the import path
import { useParams } from 'react-router-dom';

const EmployeesByDepartment = () => {
  const { departmentId } = useParams(); // Get departmentId from URL params
  const dispatch = useDispatch();
  const employees = useSelector(selectAllEmployees);
  const status = useSelector((state) => state.employees.status);
  const error = useSelector((state) => state.employees.error);
  const departmentName = useSelector((state) => state.auth.user?.department.name); // Get department name from auth slice

  useEffect(() => {
    console.log("Department ID:", departmentId); // Log department ID
    console.log("Current Status:", status); // Log current status

    if (status === 'idle') {
      console.log("Dispatching fetchEmployeesByDepartment for ID:", departmentId); // Log before dispatch
      dispatch(fetchEmployeesByDepartment(departmentId)); // Fetch employees when the component mounts
    }
  }, [departmentId, dispatch, status]);

  if (status === 'loading') {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (status === 'failed') {
    console.error("Error fetching employees:", error); // Log the error
    return (
      <Container>
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Employees in Department {departmentName || 'N/A'} {/* Display department name */}
      </Typography>
      {employees.map((employee) => (
        <Box key={employee.id} sx={{ mb: 2 }}>
          <Typography variant="h6">{employee.username}</Typography> {/* Updated to username */}
          <Typography variant="body1">Role: {employee.role}</Typography> {/* Added role */}
          <Typography variant="body1">Approved: {employee.is_approved ? 'Yes' : 'No'}</Typography> {/* Added approval status */}
        </Box>
      ))}
    </Container>
  );
};

export default EmployeesByDepartment;