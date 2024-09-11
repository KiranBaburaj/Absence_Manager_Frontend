import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  CircularProgress, 
  Alert 
} from '@mui/material';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth); // Get user from state

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // Check if the user is already logged in
  useEffect(() => {
    if (user) {
      // Redirect based on user role
      if (user.role == 'manager') {
        navigate('/ManagerDashboard'); // Redirect to manager dashboard
      } else if (user.role == 'employee') {
        navigate('/EmployeeDashboard'); // Redirect to employee dashboard
      } else {
        navigate('/login'); // Redirect to a default page if role is not recognized
      }
    }
  }, [user, navigate]); // Depend on user and navigate

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(loginUser(formData));
    
    if (!response.error) {
      // Redirect based on user role
      if (user.role == 'manager') {
        navigate('/ManagerDashboard'); // Redirect to manager dashboard
      } else if (user.role == 'employee') {
        navigate('/EmployeeDashboard'); // Redirect to employee dashboard
      } else {
        navigate('/login'); // Redirect to a default page if role is not recognized
      }
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register'); // Redirect to register page
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {typeof error === 'string' ? error : JSON.stringify(error)}
            </Alert>
          )}
          
          <Box sx={{ mt: 2, position: 'relative' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  color: 'primary.main',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </Box>
        </form>

        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={handleRegisterRedirect}
          >
            Don't have an account? Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;