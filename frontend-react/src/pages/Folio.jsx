import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';

const API_BASE_URL = "http://localhost:8080/api";

function Folio() {
  const [estanciasActivas, setEstanciasActivas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [estanciaSeleccionadaId, setEstanciaSeleccionadaId] = useState('');
  const [folioDetalle, setFolioDetalle] = useState(null);
  const [estanciaDetalle, setEstanciaDetalle] = useState(null);

  const [newCargo, setNewCargo] = useState({
    servicioId: '',
    cantidad: 1
  });

  useEffect(() => {
    fetchEstanciasActivas();
    fetchServicios();
  }, []);

  useEffect(() => {
    mostrarFolio();
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

  const fetchServicios = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/servicios`);
      setServicios(response.data);
    } catch (error) {
      console.error("Error al obtener servicios:", error);
      alert("No se pudieron cargar los servicios.");
    }
  };

  const mostrarFolio = async () => {
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
      console.error("Error al cargar folio:", error);
      alert("No se pudo cargar el folio.");
    }
  };

  const handleCargoInputChange = (e) => {
    const { id, value } = e.target;
    setNewCargo(prev => ({ ...prev, [id]: value }));
  };

  const abrirModalCargo = () => {
    if (!estanciaSeleccionadaId) {
      alert("Seleccione un huésped activo.");
      return;
    }
    setNewCargo({ servicioId: '', cantidad: 1 }); // Reset form
    const modal = new Modal(document.getElementById('modalCargo'));
    modal.show();
  };

  const agregarCargo = async () => {
    if (!newCargo.servicioId || newCargo.cantidad <= 0) {
      alert("Datos inválidos para el cargo.");
      return;
    }

    try {
      const servicio = servicios.find(s => s.id === parseInt(newCargo.servicioId));
      const cargoData = {
        folioId: folioDetalle.id,
        servicioId: newCargo.servicioId,
        cantidad: newCargo.cantidad,
        subtotal: newCargo.cantidad * servicio.precio,
        fecha: new Date().toISOString()
      };
      await axios.post(`${API_BASE_URL}/folios/cargos`, cargoData);
      alert("✅ Cargo agregado correctamente");
      Modal.getInstance(document.getElementById('modalCargo')).hide();
      mostrarFolio(); // Refresh folio details
    } catch (error) {
      console.error("Error al agregar cargo:", error);
      alert("No se pudo agregar el cargo.");
    }
  };

  const eliminarCargo = async (cargoId) => {
    if (!confirm('¿Está seguro de que desea eliminar este cargo?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/folios/cargos/${cargoId}`);
      alert("✅ Cargo eliminado correctamente");
      mostrarFolio(); // Refresh folio details
    } catch (error) {
      console.error("Error al eliminar cargo:", error);
      alert("No se pudo eliminar el cargo.");
    }
  };

  return (
    <div className="modulo">
      <h2 className="section-title">💵 Módulo de Folio (Cuenta del Huésped)</h2>
      <p className="text-muted mb-3">Selecciona un huésped activo para ver y administrar su cuenta.</p>

      <div className="row mb-4">
        <div className="col-md-6">
          <label htmlFor="selectHuesped" className="form-label">Huésped activo</label>
          <select id="selectHuesped" className="form-select" value={estanciaSeleccionadaId} onChange={(e) => setEstanciaSeleccionadaId(e.target.value)}>
            <option value="">-- Selecciona un huésped --</option>
            {estanciasActivas.map(e => (
              <option key={e.id} value={e.id}>{e.clienteNombre} (Hab. {e.habitacionNumero})</option>
            ))}
          </select>
        </div>
      </div>

      {folioDetalle && estanciaDetalle && (
        <div id="folioDetalle">
          <hr />
          <h4>Huésped: {estanciaDetalle.clienteNombre}</h4>
          <p><strong>Habitación:</strong> {estanciaDetalle.habitacionNumero}</p>
          <p><strong>Fechas:</strong> {new Date(estanciaDetalle.fechaCheckIn).toLocaleDateString()} → {estanciaDetalle.fechaCheckOut ? new Date(estanciaDetalle.fechaCheckOut).toLocaleDateString() : 'Presente'}</p>

          <h5 className="mt-4">🧾 Cargos y Pagos</h5>
          <table className="table table-sm table-striped mt-2">
            <thead className="table-light">
              <tr>
                <th>Descripción</th>
                <th>Monto (USD)</th>
                <th>Fecha</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {folioDetalle.cargos.length > 0 ? (
                folioDetalle.cargos.map(c => (
                  <tr key={c.id}>
                    <td>{c.servicioNombre}</td>
                    <td>${c.subtotal.toFixed(2)}</td>
                    <td>{new Date(c.fecha).toLocaleString()}</td>
                    <td><button className="btn btn-sm btn-outline-danger" onClick={() => eliminarCargo(c.id)}>X</button></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted">No hay movimientos registrados.</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-success" onClick={abrirModalCargo}>+ Agregar Cargo</button>
          </div>

          <hr />
          <h4>Total: <span className={`fw-bold ${folioDetalle.total > 0 ? 'text-danger' : ''}`}>${folioDetalle.total.toFixed(2)}</span></h4>
        </div>
      )}

      {/* Modal para agregar cargo */}
      <div className="modal fade" id="modalCargo" tabIndex="-1" aria-labelledby="modalCargoLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalCargoLabel">Agregar Cargo</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="servicioId" className="form-label">Servicio</label>
                  <select id="servicioId" className="form-select" value={newCargo.servicioId} onChange={handleCargoInputChange} required>
                    <option value="">Seleccione un servicio</option>
                    {servicios.map(s => (
                      <option key={s.id} value={s.id} data-precio={s.precio}>{s.nombre} (${s.precio})</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="cantidad" className="form-label">Cantidad</label>
                  <input type="number" id="cantidad" className="form-control" min="1" value={newCargo.cantidad} onChange={handleCargoInputChange} required />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" className="btn btn-primary" onClick={agregarCargo}>Guardar Cargo</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Folio;
