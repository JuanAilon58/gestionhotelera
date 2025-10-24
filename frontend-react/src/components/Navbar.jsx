import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">🏨 HotelApp</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMenu">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMenu">
          {user && (
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><Link className="nav-link" to="/">Dashboard</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/reservas">Reservas</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/checkin">Check-In</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/folio">Folio</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/checkout">Check-Out</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/ama-de-llaves">Ama de Llaves</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/configuracion">Configuración</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/reportes">Reportes</Link></li>
            </ul>
          )}
          {user && (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <span className="nav-link text-white">Bienvenido, {user.username}</span>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-light" onClick={logout}>Cerrar Sesión</button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
