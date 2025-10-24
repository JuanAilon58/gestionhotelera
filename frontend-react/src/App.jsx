import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Reservas from './pages/Reservas';
import CheckIn from './pages/CheckIn';
import Folio from './pages/Folio';
import CheckOut from './pages/CheckOut';
import AmaDeLlaves from './pages/AmaDeLlaves';
import Configuracion from './pages/Configuracion';
import Reportes from './pages/Reportes';
import Login from './pages/Login';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? (
    <>
      <Navbar />
      {children}
    </>
  ) : (
    <Navigate to="/login" replace />
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="container mt-4">
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/reservas" element={<PrivateRoute><Reservas /></PrivateRoute>} />
            <Route path="/checkin" element={<PrivateRoute><CheckIn /></PrivateRoute>} />
            <Route path="/folio" element={<PrivateRoute><Folio /></PrivateRoute>} />
            <Route path="/checkout" element={<PrivateRoute><CheckOut /></PrivateRoute>} />
            <Route path="/ama-de-llaves" element={<PrivateRoute><AmaDeLlaves /></PrivateRoute>} />
            <Route path="/configuracion" element={<PrivateRoute><Configuracion /></PrivateRoute>} />
            <Route path="/reportes" element={<PrivateRoute><Reportes /></PrivateRoute>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
