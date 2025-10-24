import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api";

function Reportes() {
  const [habitaciones, setHabitaciones] = useState([]);
  const [estancias, setEstancias] = useState([]);
  const [folios, setFolios] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [habitacionesRes, estanciasRes, foliosRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/habitaciones`),
        axios.get(`${API_BASE_URL}/estancias`),
        axios.get(`${API_BASE_URL}/folios`)
      ]);
      setHabitaciones(habitacionesRes.data);
      setEstancias(estanciasRes.data);
      setFolios(foliosRes.data);
    } catch (error) {
      console.error("Error al obtener datos para reportes:", error);
      alert("No se pudieron cargar los datos para los reportes.");
    }
  };

  // --- Ocupación ---
  const ocupadas = habitaciones.filter(h => h.estado === "ocupada").length;
  const totalHabitaciones = habitaciones.length || 1;
  const porcentajeOcupacion = ((ocupadas / totalHabitaciones) * 100).toFixed(1);

  // --- Estados ---
  const estadosCount = habitaciones.reduce((acc, h) => {
    acc[h.estado] = (acc[h.estado] || 0) + 1;
    return acc;
  }, {});
  const estadosDisplay = Object.entries(estadosCount)
    .map(([estado, cant]) => `${estado}: ${cant}`)
    .join(", ");

  // --- Ingresos ---
  const ingresosTotales = folios.reduce((total, folio) => total + folio.total, 0);

  // --- Historial de Check-Outs ---
  const historialCheckOuts = estancias.filter(e => e.estado === 'finalizada');

  return (
    <div className="modulo">
      <h2 className="section-title">📊 Reportes y Estadísticas</h2>

      <div className="row text-center mb-4">
        <div className="col-md-4">
          <div className="card border-success">
            <div className="card-body">
              <h5 className="card-title text-success">Ocupación Actual</h5>
              <h3>{porcentajeOcupacion}% ({ocupadas}/{totalHabitaciones})</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-warning">
            <div className="card-body">
              <h5 className="card-title text-warning">Habitaciones por Estado</h5>
              <p>{estadosDisplay}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-primary">
            <div className="card-body">
              <h5 className="card-title text-primary">Ingresos Totales</h5>
              <h3>${ingresosTotales.toFixed(2)}</h3>
            </div>
          </div>
        </div>
      </div>

      <hr />
      <h5>Historial de Check-Outs</h5>
      <table className="table table-sm table-striped mt-2">
        <thead className="table-light">
          <tr><th>Huésped</th><th>Hab.</th><th>Salida</th></tr>
        </thead>
        <tbody>
          {historialCheckOuts.length > 0 ? (
            historialCheckOuts.map(h => (
              <tr key={h.id}>
                <td>{h.clienteNombre}</td>
                <td>{h.habitacionNumero}</td>
                <td>{new Date(h.fechaCheckOut).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center text-muted">No hay registros aún.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Reportes;
