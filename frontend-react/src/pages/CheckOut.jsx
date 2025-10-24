import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = "http://localhost:8080/api";

function CheckOut() {
  const [estanciasActivas, setEstanciasActivas] = useState([]);
  const [estanciaSeleccionadaId, setEstanciaSeleccionadaId] = useState('');
  const [folioDetalle, setFolioDetalle] = useState(null);
  const [estanciaDetalle, setEstanciaDetalle] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEstanciasActivas();
  }, []);

  useEffect(() => {
    mostrarResumenCheckout();
  }, [estanciaSeleccionadaId]);

  const fetchEstanciasActivas = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/estancias`);
      setEstanciasActivas(response.data.filter(e => e.estado === 'activa'));
    } catch (error) {
      console.error("Error al obtener estancias activas:", error);
      alert("No se pudieron cargar los huéspedes activos.");
    }
  };

  const mostrarResumenCheckout = async () => {
    if (!estanciaSeleccionadaId) {
      setFolioDetalle(null);
      setEstanciaDetalle(null);
      return;
    }
    try {
      const [estanciaRes, folioRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/estancias/${estanciaSeleccionadaId}`),
        axios.get(`${API_BASE_URL}/folios/estancia/${estanciaSeleccionadaId}`)
      ]);
      setEstanciaDetalle(estanciaRes.data);
      setFolioDetalle(folioRes.data);
    } catch (error) {
      console.error("Error al cargar resumen de checkout:", error);
      alert("No se pudo cargar el resumen de checkout.");
    }
  };

  const confirmarCheckout = async () => {
    if (!estanciaSeleccionadaId) {
      alert("Seleccione un huésped primero.");
      return;
    }

    if (folioDetalle.total > 0) {
      alert("⚠️ No se puede realizar el Check-Out. El saldo no está en cero.");
      return;
    }

    try {
      // Actualizar estado de la estancia a 'finalizada'
      const updatedEstancia = { ...estanciaDetalle, estado: 'finalizada', fechaCheckOut: new Date().toISOString() };
      await axios.put(`${API_BASE_URL}/estancias/${estanciaSeleccionadaId}`, updatedEstancia);

      // Actualizar estado de la habitación a 'limpieza'
      const habitacionRes = await axios.get(`${API_BASE_URL}/habitaciones/${estanciaDetalle.habitacionId}`);
      const habitacion = habitacionRes.data;
      await axios.put(`${API_BASE_URL}/habitaciones/${habitacion.id}`, { ...habitacion, estado: 'limpieza' });

      alert(`✅ Check-Out realizado con éxito.\nHabitación ${habitacion.numero} marcada como "limpieza".`);
      fetchEstanciasActivas(); // Refresh active stays
      setEstanciaSeleccionadaId('');
      setEstanciaDetalle(null);
      setFolioDetalle(null);
    } catch (error) {
      console.error("Error al confirmar check-out:", error);
      alert("No se pudo confirmar el check-out.");
    }
  };

  const verFolioDesdeCheckout = () => {
    if (estanciaSeleccionadaId) {
      navigate(`/folio?estanciaId=${estanciaSeleccionadaId}`);
    } else {
      alert("Seleccione un huésped para ver su folio.");
    }
  };

  return (
    <div className="modulo">
      <h2 className="section-title">🚪 Módulo de Check-Out</h2>
      <p className="text-muted">Selecciona un huésped activo para procesar su salida.</p>

      <div className="row mb-4">
        <div className="col-md-6">
          <label htmlFor="selectCheckOut" className="form-label">Huésped activo</label>
          <select id="selectCheckOut" className="form-select" value={estanciaSeleccionadaId} onChange={(e) => setEstanciaSeleccionadaId(e.target.value)}>
            <option value="">-- Selecciona un huésped --</option>
            {estanciasActivas.map(e => (
              <option key={e.id} value={e.id}>{e.clienteNombre} (Hab. {e.habitacionNumero})</option>
            ))}
          </select>
        </div>
      </div>

      {estanciaDetalle && folioDetalle && (
        <div id="resumenCheckout">
          <hr />
          <h4>Huésped: {estanciaDetalle.clienteNombre}</h4>
          <p><strong>Habitación:</strong> {estanciaDetalle.habitacionNumero}</p>
          <p><strong>Fechas:</strong> {new Date(estanciaDetalle.fechaCheckIn).toLocaleDateString()} → {estanciaDetalle.fechaCheckOut ? new Date(estanciaDetalle.fechaCheckOut).toLocaleDateString() : 'Presente'}</p>
          <h5 className="mt-3">💵 Estado de Cuenta</h5>
          <p><strong>Saldo Actual:</strong> <span className={`fw-bold ${folioDetalle.total > 0 ? 'text-danger' : 'text-success'}`}>${folioDetalle.total.toFixed(2)}</span></p>

          <div className="mt-4 d-flex gap-2">
            <button className="btn btn-info" onClick={verFolioDesdeCheckout}>Ver Folio</button>
            <button className="btn btn-success" onClick={confirmarCheckout}>Confirmar Check-Out</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckOut;
