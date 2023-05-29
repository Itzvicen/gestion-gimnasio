// src/AppRouter.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoutes from './components/ProtectedRoutes';

const AppRouter = () => {
  return (
    <div className="App">
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<ProtectedRoutes />}>
          <Route index element={<DashboardPage />} />
        </Route>
      </Routes>
    </Router>
    </div>
  );
};

export default AppRouter;
