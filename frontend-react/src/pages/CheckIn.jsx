import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';

const API_BASE_URL = "http://localhost:8080/api";

function CheckIn() {
  const [reservacionesPendientes, setReservacionesPendientes] = useState([]);
  const [habitacionesDisponibles, setHabitacionesDisponibles] = useState([]);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [habitacionAsignadaId, setHabitacionAsignadaId] = useState('');

  useEffect(() => {
    fetchReservacionesPendientes();
    fetchHabitacionesDisponibles();
  }, []);

  const fetchReservacionesPendientes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reservaciones`);
      setReservacionesPendientes(response.data.filter(r => r.estado === 'pendiente'));
    } catch (error) {
      console.error("Error al obtener reservas pendientes:", error);
      alert("No se pudieron cargar las reservas pendientes.");
    }
  };

  const fetchHabitacionesDisponibles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/habitaciones`);
      setHabitacionesDisponibles(response.data.filter(h => h.estado === 'disponible'));
    } catch (error) {
      console.error("Error al obtener habitaciones disponibles:", error);
      alert("No se pudieron cargar las habitaciones disponibles.");
    }
  };

  const abrirAsignacion = (reservaId) => {
    const reserva = reservacionesPendientes.find(r => r.id === reservaId);
    setReservaSeleccionada(reserva);
    setHabitacionAsignadaId(''); // Reset selected room
    const modal = new Modal(document.getElementById('modalAsignar'));
    modal.show();
  };

  const confirmarCheckIn = async () => {
    if (!reservaSeleccionada || !habitacionAsignadaId) {
      alert('Debe seleccionar una reserva y una habitación.');
      return;
    }

    const checkInData = {
      reservacionId: reservaSeleccionada.id,
      habitacionId: habitacionAsignadaId,
      clienteId: reservaSeleccionada.clienteId,
      fechaCheckIn: new Date().toISOString(),
      estado: 'activa'
    };

    try {
      // Crear la estancia (Check-in)
      await axios.post(`${API_BASE_URL}/estancias`, checkInData);

      // Actualizar estado de la habitación a 'ocupada'
      const habitacion = habitacionesDisponibles.find(h => h.id === parseInt(habitacionAsignadaId));
      await axios.put(`${API_BASE_URL}/habitaciones/${habitacion.id}`, { ...habitacion, estado: 'ocupada' });

      // Actualizar estado de la reservacion a 'confirmada'
      await axios.put(`${API_BASE_URL}/reservaciones/${reservaSeleccionada.id}`, { ...reservaSeleccionada, estado: 'confirmada' });

      alert(`✅ Check-In realizado correctamente\nHuésped: ${reservaSeleccionada.clienteNombre}\nHab. ${habitacion.numero}`);
      
      // Close modal and refresh data
      Modal.getInstance(document.getElementById('modalAsignar')).hide();
      fetchReservacionesPendientes();
      fetchHabitacionesDisponibles();
    } catch (error) {
      console.error("Error al confirmar check-in:", error);
      alert("No se pudo confirmar el check-in.");
    }
  };

  return (
    <div className="modulo">
      <h2 className="section-title">🧳 Módulo de Check-In</h2>
      <p className="mb-3">Selecciona una reserva para realizar el registro de entrada.</p>

      <table className="table table-hover table-bordered">
        <thead className="table-light">
          <tr>
            <th>ID Reserva</th>
            <th>Huésped</th>
            <th>Llegada</th>
            <th>Salida</th>
            <th>Habitación</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {reservacionesPendientes.length > 0 ? (
            reservacionesPendientes.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.clienteNombre}</td>
                <td>{r.fechaLlegada}</td>
                <td>{r.fechaSalida}</td>
                <td>{r.habitacionNumero}</td>
                <td><button className="btn btn-sm btn-primary" onClick={() => abrirAsignacion(r.id)}>Asignar</button></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center text-muted">No hay reservas pendientes.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal de Asignación */}
      <div className="modal fade" id="modalAsignar" tabIndex="-1" aria-labelledby="modalAsignarLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="modalAsignarLabel">Asignar Habitación</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {reservaSeleccionada && (
                <p>Reserva #{reservaSeleccionada.id} - Huésped: {reservaSeleccionada.clienteNombre}</p>
              )}
              <label htmlFor="habitacionSelect" className="form-label">Seleccionar habitación libre</label>
              <select id="habitacionSelect" className="form-select" value={habitacionAsignadaId} onChange={(e) => setHabitacionAsignadaId(e.target.value)}>
                <option value="">-- Seleccione una habitación --</option>
                {habitacionesDisponibles.map(h => (
                  <option key={h.id} value={h.id}>Habitación {h.numero} ({h.tipoHabitacionNombre})</option>
                ))}
              </select>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" aria-label="Close">Cancelar</button>
              <button type="button" className="btn btn-success" onClick={confirmarCheckIn}>Confirmar Check-In</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckIn;
