import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api";

function AmaDeLlaves() {
  const [habitaciones, setHabitaciones] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('todos');

  useEffect(() => {
    fetchHabitaciones();
  }, [filtroEstado]);

  const fetchHabitaciones = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/habitaciones`);
      setHabitaciones(response.data);
    } catch (error) {
      console.error("Error al obtener las habitaciones:", error);
      alert("No se pudieron cargar las habitaciones.");
    }
  };

  const getEstadoClass = (estado) => {
    switch (estado) {
      case "disponible": return "success";
      case "ocupada": return "secondary";
      case "limpieza": return "danger";
      case "mantenimiento": return "warning";
      default: return "light";
    }
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    if (!confirm(`¿Está seguro de cambiar el estado de la habitación a "${nuevoEstado}"?`)) return;

    try {
      const habitacionRes = await axios.get(`${API_BASE_URL}/habitaciones/${id}`);
      const habitacion = habitacionRes.data;
      
      await axios.put(`${API_BASE_URL}/habitaciones/${id}`, { ...habitacion, estado: nuevoEstado });
      alert(`Habitación ${habitacion.numero} actualizada a "${nuevoEstado}".`);
      fetchHabitaciones(); // Refresh data
    } catch (error) {
      console.error("Error al cambiar el estado de la habitación:", error);
      alert("No se pudo cambiar el estado de la habitación.");
    }
  };

  const filteredHabitaciones = filtroEstado === 'todos'
    ? habitaciones
    : habitaciones.filter(h => h.estado === filtroEstado);

  return (
    <div className="modulo">
      <h2 className="section-title">🧹 Módulo de Ama de Llaves</h2>

      <div className="mb-3">
        <label htmlFor="filtroEstado" className="form-label">Filtrar por Estado:</label>
        <select id="filtroEstado" className="form-select w-auto d-inline-block" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="todos">Todos</option>
          <option value="disponible">Disponible</option>
          <option value="ocupada">Ocupada</option>
          <option value="limpieza">Limpieza</option>
          <option value="mantenimiento">Mantenimiento</option>
        </select>
      </div>

      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Número</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredHabitaciones.length > 0 ? (
            filteredHabitaciones.map(h => (
              <tr key={h.id}>
                <td>{h.numero}</td>
                <td>{h.tipoHabitacionNombre}</td>
                <td><span className={`badge bg-${getEstadoClass(h.estado)}`}>{h.estado}</span></td>
                <td>
                  <button className="btn btn-sm btn-outline-success me-1" onClick={() => cambiarEstado(h.id, 'disponible')}>Marcar Disponible</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => cambiarEstado(h.id, 'limpieza')}>Marcar Limpieza</button>
                  <button className="btn btn-sm btn-outline-warning ms-1" onClick={() => cambiarEstado(h.id, 'mantenimiento')}>Marcar Mantenimiento</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-muted">No hay habitaciones con ese estado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AmaDeLlaves;
