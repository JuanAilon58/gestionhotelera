import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api";

function Configuracion() {
  const [tiposHabitacion, setTiposHabitacion] = useState([]);
  const [habitaciones, setHabitaciones] = useState([]);
  const [clientes, setClientes] = useState([]); // New state for clients

  const [newTipoHabitacion, setNewTipoHabitacion] = useState({
    nombre: '',
    descripcion: '',
    capacidad: 1,
    precio: 0
  });

  const [newHabitacion, setNewHabitacion] = useState({
    numero: '',
    tipoHabitacionId: '',
    estado: 'disponible'
  });

  const [newCliente, setNewCliente] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    nit: '',
    fechaNacimiento: ''
  });

  const [editingCliente, setEditingCliente] = useState(null); // State for client being edited

  useEffect(() => {
    fetchTiposHabitacion();
    fetchHabitaciones();
    fetchClientes(); // Fetch clients on component mount
  }, []);

  const fetchTiposHabitacion = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tipos-habitacion`);
      setTiposHabitacion(response.data);
    } catch (error) {
      console.error("Error al obtener tipos de habitación:", error);
      alert("No se pudieron cargar los tipos de habitación.");
    }
  };

  const fetchHabitaciones = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/habitaciones`);
      setHabitaciones(response.data);
    } catch (error) {
      console.error("Error al obtener habitaciones:", error);
      alert("No se pudieron cargar las habitaciones.");
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/clientes`);
      setClientes(response.data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      alert("No se pudieron cargar los clientes.");
    }
  };

  const handleTipoHabitacionChange = (e) => {
    const { id, value } = e.target;
    setNewTipoHabitacion(prev => ({ ...prev, [id]: value }));
  };

  const handleHabitacionChange = (e) => {
    const { id, value } = e.target;
    setNewHabitacion(prev => ({ ...prev, [id]: value }));
  };

  const handleClienteChange = (e) => {
    const { id, value } = e.target;
    setNewCliente(prev => ({ ...prev, [id]: value }));
  };

  const handleAddTipoHabitacion = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/tipos-habitacion`, newTipoHabitacion);
      alert("✅ Tipo de habitación agregado correctamente");
      setNewTipoHabitacion({ nombre: '', descripcion: '', capacidad: 1, precio: 0 });
      fetchTiposHabitacion();
    } catch (error) {
      console.error("Error al agregar tipo de habitación:", error);
      alert("No se pudo agregar el tipo de habitación.");
    }
  };

  const handleDeleteTipoHabitacion = async (id) => {
    if (!confirm('¿Está seguro de que desea eliminar este tipo de habitación?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/tipos-habitacion/${id}`);
      alert("✅ Tipo de habitación eliminado correctamente");
      fetchTiposHabitacion();
    } catch (error) {
      console.error("Error al eliminar tipo de habitación:", error);
      alert("No se pudo eliminar el tipo de habitación.");
    }
  };

  const handleAddHabitacion = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/habitaciones`, newHabitacion);
      alert("✅ Habitación agregada correctamente");
      setNewHabitacion({ numero: '', tipoHabitacionId: '', estado: 'disponible' });
      fetchHabitaciones();
    } catch (error) {
      console.error("Error al agregar habitación:", error);
      alert("No se pudo agregar la habitación.");
    }
  };

  const handleDeleteHabitacion = async (id) => {
    if (!confirm('¿Está seguro de que desea eliminar esta habitación?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/habitaciones/${id}`);
      alert("✅ Habitación eliminada correctamente");
      fetchHabitaciones();
    } catch (error) {
      console.error("Error al eliminar habitación:", error);
      alert("No se pudo eliminar la habitación.");
    }
  };

  const handleAddOrUpdateCliente = async (e) => {
    e.preventDefault();
    try {
      if (editingCliente) {
        await axios.put(`${API_BASE_URL}/clientes/${editingCliente.id}`, newCliente);
        alert("✅ Cliente actualizado correctamente");
        setEditingCliente(null);
      } else {
        await axios.post(`${API_BASE_URL}/clientes`, newCliente);
        alert("✅ Cliente agregado correctamente");
      }
      setNewCliente({ nombre: '', apellido: '', email: '', telefono: '', direccion: '', nit: '', fechaNacimiento: '' });
      fetchClientes();
    } catch (error) {
      console.error("Error al guardar cliente:", error);
      alert("No se pudo guardar el cliente.");
    }
  };

  const handleEditCliente = (cliente) => {
    setNewCliente(cliente);
    setEditingCliente(cliente);
  };

  const handleDeleteCliente = async (id) => {
    if (!confirm('¿Está seguro de que desea eliminar este cliente?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/clientes/${id}`);
      alert("✅ Cliente eliminado correctamente");
      fetchClientes();
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      alert("No se pudo eliminar el cliente.");
    }
  };

  return (
    <div className="modulo">
      <h2 className="section-title">⚙️ Configuración del Sistema</h2>
      <ul className="nav nav-tabs mb-4" id="configTabs">
        <li className="nav-item"><button className="nav-link active" data-bs-toggle="tab" data-bs-target="#hab">Habitaciones</button></li>
        <li className="nav-item"><button className="nav-link" data-bs-toggle="tab" data-bs-target="#tipos">Tipos de Habitación</button></li>
        <li className="nav-item"><button className="nav-link" data-bs-toggle="tab" data-bs-target="#clientes">Clientes</button></li> {/* New tab */}
      </ul>

      <div className="tab-content">
        {/* TAB 1: HABITACIONES */}
        <div className="tab-pane fade show active" id="hab">
          <h5>Gestión de Habitaciones</h5>
          <form onSubmit={handleAddHabitacion} className="row g-3 mb-3">
            <div className="col-md-3">
              <input type="text" className="form-control" id="numero" placeholder="Número" value={newHabitacion.numero} onChange={handleHabitacionChange} required />
            </div>
            <div className="col-md-4">
              <select className="form-select" id="tipoHabitacionId" value={newHabitacion.tipoHabitacionId} onChange={handleHabitacionChange} required>
                <option value="">Seleccione Tipo</option>
                {tiposHabitacion.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select" id="estado" value={newHabitacion.estado} onChange={handleHabitacionChange}>
                <option value="disponible">Disponible</option>
                <option value="ocupada">Ocupada</option>
                <option value="limpieza">Limpieza</option>
                <option value="mantenimiento">Mantenimiento</option>
              </select>
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-success w-100">Agregar</button>
            </div>
          </form>

          <table className="table table-striped table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Número</th><th>Tipo</th><th>Estado</th><th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {habitaciones.length > 0 ? (
                habitaciones.map(h => (
                  <tr key={h.id}>
                    <td>{h.numero}</td><td>{h.tipoHabitacionNombre}</td><td>{h.estado}</td>
                    <td><button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteHabitacion(h.id)}>Eliminar</button></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted">No hay habitaciones registradas.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* TAB 2: TIPOS DE HABITACIÓN */}
        <div className="tab-pane fade" id="tipos">
          <h5>Tipos de Habitación</h5>
          <form onSubmit={handleAddTipoHabitacion} className="row g-3 mb-3">
            <div className="col-md-3">
              <input type="text" className="form-control" id="nombre" placeholder="Ej. Simple, Doble..." value={newTipoHabitacion.nombre} onChange={handleTipoHabitacionChange} required />
            </div>
            <div className="col-md-3">
              <input type="number" className="form-control" id="capacidad" placeholder="Capacidad" value={newTipoHabitacion.capacidad} onChange={handleTipoHabitacionChange} required />
            </div>
            <div className="col-md-3">
              <input type="number" className="form-control" id="precio" placeholder="Precio (USD)" value={newTipoHabitacion.precio} onChange={handleTipoHabitacionChange} required />
            </div>
            <div className="col-md-3">
              <button type="submit" className="btn btn-success w-100">Agregar Tipo</button>
            </div>
          </form>

          <ul className="list-group">
            {tiposHabitacion.length > 0 ? (
              tiposHabitacion.map(tipo => (
                <li key={tipo.id} className="list-group-item d-flex justify-content-between align-items-center">
                  {tipo.nombre} (Cap: {tipo.capacidad}, Precio: ${tipo.precio})
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteTipoHabitacion(tipo.id)}>Eliminar</button>
                </li>
              ))
            ) : (
              <li className="list-group-item text-center text-muted">No hay tipos de habitación registrados.</li>
            )}
          </ul>
        </div>

        {/* TAB 3: CLIENTES */}
        <div className="tab-pane fade" id="clientes">
          <h5>Gestión de Clientes</h5>
          <form onSubmit={handleAddOrUpdateCliente} className="row g-3 mb-3">
            <div className="col-md-4">
              <input type="text" className="form-control" id="nombre" placeholder="Nombre" value={newCliente.nombre} onChange={handleClienteChange} required />
            </div>
            <div className="col-md-4">
              <input type="text" className="form-control" id="apellido" placeholder="Apellido" value={newCliente.apellido} onChange={handleClienteChange} required />
            </div>
            <div className="col-md-4">
              <input type="email" className="form-control" id="email" placeholder="Email" value={newCliente.email} onChange={handleClienteChange} required />
            </div>
            <div className="col-md-4">
              <input type="text" className="form-control" id="telefono" placeholder="Teléfono" value={newCliente.telefono} onChange={handleClienteChange} />
            </div>
            <div className="col-md-4">
              <input type="text" className="form-control" id="direccion" placeholder="Dirección" value={newCliente.direccion} onChange={handleClienteChange} />
            </div>
            <div className="col-md-2">
              <input type="text" className="form-control" id="nit" placeholder="NIT" value={newCliente.nit} onChange={handleClienteChange} />
            </div>
            <div className="col-md-2">
              <input type="date" className="form-control" id="fechaNacimiento" value={newCliente.fechaNacimiento} onChange={handleClienteChange} />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary me-2">{editingCliente ? 'Actualizar Cliente' : 'Agregar Cliente'}</button>
              {editingCliente && (
                <button type="button" className="btn btn-secondary" onClick={() => { setNewCliente({ nombre: '', apellido: '', email: '', telefono: '', direccion: '', nit: '', fechaNacimiento: '' }); setEditingCliente(null); }}>Cancelar Edición</button>
              )}
            </div>
          </form>

          <table className="table table-striped table-hover align-middle mt-3">
            <thead className="table-light">
              <tr>
                <th>ID</th><th>Nombre</th><th>Apellido</th><th>Email</th><th>Teléfono</th><th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {clientes.length > 0 ? (
                clientes.map(c => (
                  <tr key={c.id}>
                    <td>{c.id}</td><td>{c.nombre}</td><td>{c.apellido}</td><td>{c.email}</td><td>{c.telefono}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditCliente(c)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteCliente(c.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted">No hay clientes registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Configuracion;