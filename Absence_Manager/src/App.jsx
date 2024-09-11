// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';

import EmployeeDashboard from './components/Employee/EmployeeDashboard';
import ManagerDashboard from './components/Manager/ManagerDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/EmployeeDashboard" element={<EmployeeDashboard />} />
        <Route path="/ManagerDashboard" element={<ManagerDashboard/>} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
};

export default App;
