import React from 'react';
import ReactDOM from 'react-dom/client';
import HomeInvoice from './Invoice/HomeInvoice';
import Login from './Invoice/Login/Login';
import { AuthProvider, useAuth } from './Invoice/Login/AuthContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './input.css'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<PrivateRoute><HomeInvoice /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);