import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api";

function Dashboard() {
  const [habitaciones, setHabitaciones] = useState([]);

  useEffect(() => {
    const fetchHabitaciones = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/habitaciones`);
        setHabitaciones(response.data);
      } catch (error) {
        console.error("Error al obtener las habitaciones:", error);
        alert("No se pudieron cargar las habitaciones.");
      }
    };
    fetchHabitaciones();
  }, []);

  const getEstadoClass = (estado) => {
    switch (estado) {
      case "disponible": return "libre";
      case "ocupada": return "ocupada";
      case "limpieza": return "sucia"; // Assuming 'limpieza' maps to 'sucia' for visual
      case "mantenimiento": return "mantenimiento";
      default: return "";
    }
  };

  return (
    <div className="modulo">
      <h2 className="section-title">🏠 Panel de Recepción</h2>
      <div className="d-flex justify-content-around mb-4">
        <Link to="/checkin" className="btn btn-success">Check-In</Link>
        <Link to="/checkout" className="btn btn-danger">Check-Out</Link>
        <Link to="/reservas" className="btn btn-primary">Nueva Reserva</Link>
      </div>
      <h5 className="mb-3">Rack de Habitaciones</h5>
      <div className="rack">
        {habitaciones.length > 0 ? (
          habitaciones.map((h) => (
            <div key={h.id} className={`habitacion ${getEstadoClass(h.estado)}`}>
              <div>Hab. {h.numero}</div>
              <small>{h.estado.toUpperCase()}</small>
            </div>
          ))
        ) : (
          <p className="text-muted">No hay habitaciones registradas.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
