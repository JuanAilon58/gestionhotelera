import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Importar useAuth

const API_BASE_URL = "http://localhost:8080/api";

function Reservas() {
  const { isAdmin } = useAuth(); // Obtener la función isAdmin
  const [clientes, setClientes] = useState([]);
  const [habitaciones, setHabitaciones] = useState([]);
  const [tiposHabitacion, setTiposHabitacion] = useState([]);
  const [reservaciones, setReservaciones] = useState([]);
  const [editingReservacion, setEditingReservacion] = useState(null);

  const [newReserva, setNewReserva] = useState({
    clienteId: '',
    habitacionId: '',
    fechaLlegada: '',
    fechaSalida: '',
    estado: 'pendiente'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [clientesRes, habitacionesRes, tiposRes, reservasRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/clientes`),
        axios.get(`${API_BASE_URL}/habitaciones`),
        axios.get(`${API_BASE_URL}/tipos-habitacion`),
        axios.get(`${API_BASE_URL}/reservaciones`)
      ]);
      setClientes(clientesRes.data);
      setHabitaciones(habitacionesRes.data);
      setTiposHabitacion(tiposRes.data);
      setReservaciones(reservasRes.data);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      alert("No se pudieron cargar los datos para el módulo de reservas.");
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewReserva(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingReservacion) {
        await axios.put(`${API_BASE_URL}/reservaciones/${editingReservacion.id}`, newReserva);
        alert("✅ Reserva actualizada correctamente");
        setEditingReservacion(null);
      } else {
        await axios.post(`${API_BASE_URL}/reservaciones`, newReserva);
        alert("✅ Reserva guardada correctamente");
      }
      setNewReserva({
        clienteId: '',
        habitacionId: '',
        fechaLlegada: '',
        fechaSalida: '',
        estado: 'pendiente'
      });
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error al guardar reserva:", error);
      alert("No se pudo guardar la reserva.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Está seguro de que desea eliminar esta reserva?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/reservaciones/${id}`);
      alert("✅ Reserva eliminada correctamente");
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error al eliminar reserva:", error);
      alert("No se pudo eliminar la reserva.");
    }
  };

  const handleEditReservacion = (reserva) => {
    setNewReserva(reserva);
    setEditingReservacion(reserva);
  };

  return (
    <div className="modulo">
      <h2 className="section-title">📅 Módulo de Reservas</h2>

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label htmlFor="clienteId" className="form-label">Cliente</label>
          <select id="clienteId" className="form-select" value={newReserva.clienteId} onChange={handleInputChange} required>
            <option value="">Seleccione un cliente</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>{c.nombre} {c.apellido}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label htmlFor="fechaLlegada" className="form-label">Fecha de llegada</label>
          <input type="date" className="form-control" id="fechaLlegada" value={newReserva.fechaLlegada} onChange={handleInputChange} required />
        </div>
        <div className="col-md-3">
          <label htmlFor="fechaSalida" className="form-label">Fecha de salida</label>
          <input type="date" className="form-control" id="fechaSalida" value={newReserva.fechaSalida} onChange={handleInputChange} required />
        </div>
        <div className="col-md-4">
          <label htmlFor="habitacionId" className="form-label">Habitación</label>
          <select id="habitacionId" className="form-select" value={newReserva.habitacionId} onChange={handleInputChange} required>
            <option value="">Seleccione una habitación</option>
            {habitaciones.map(h => (
              <option key={h.id} value={h.id}>{h.numero} ({h.tipoHabitacionNombre})</option>
            ))}
          </select>
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">{editingReservacion ? 'Actualizar Reserva' : 'Guardar Reserva'}</button>
          {editingReservacion && (
            <button type="button" className="btn btn-secondary ms-2" onClick={() => { setEditingReservacion(null); setNewReserva({ clienteId: '', habitacionId: '', fechaLlegada: '', fechaSalida: '', estado: 'pendiente' }); }}>Cancelar</button>
          )}
        </div>
      </form>

      <hr />

      <h5>Reservas Registradas</h5>
      <table className="table table-bordered table-hover mt-3">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Huésped</th>
            <th>Llegada</th>
            <th>Salida</th>
            <th>Habitación</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {reservaciones.length > 0 ? (
            reservaciones.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.clienteNombre}</td>
                <td>{r.fechaLlegada}</td>
                <td>{r.fechaSalida}</td>
                <td>{r.habitacionNumero}</td>
                <td>{r.estado}</td>
                <td>
                  {isAdmin() && (
                    <>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditReservacion(r)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(r.id)}>Eliminar</button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center text-muted">No hay reservas registradas.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Reservas;
