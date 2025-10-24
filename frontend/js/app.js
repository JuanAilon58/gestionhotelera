const contenedor = document.getElementById("contenido");
const API_BASE_URL = "http://localhost:8080/api";

/* ==========================================================
   FUNCIÓN PRINCIPAL: CAMBIAR DE VISTA
========================================================== */
function mostrarVista(vista) {
  switch (vista) {
    case "dashboard": cargarDashboard(); break;
    case "reservas": cargarReservas(); break;
    case "checkin": cargarCheckIn(); break;
    case "folio": cargarFolio(); break;
    case "checkout": cargarCheckOut(); break;
    case "ama": cargarAmaLlaves(); break;
    case "configuracion": cargarConfiguracion(); break;
    case "reportes": cargarReportes(); break;
    default: cargarDashboard(); break;
  }
}

/* ==========================================================
   DASHBOARD
========================================================== */
async function cargarDashboard() {
  contenedor.innerHTML = `
    <div class="modulo">
      <h2 class="section-title">🏠 Dashboard / Recepción</h2>
      <div class="d-flex justify-content-around mb-4">
        <button class="btn btn-success" onclick="mostrarVista('checkin')">Check-In</button>
        <button class="btn btn-danger" onclick="mostrarVista('checkout')">Check-Out</button>
        <button class="btn btn-primary" onclick="mostrarVista('reservas')">Nueva Reserva</button>
      </div>
      <h5 class="mb-3">Rack de Habitaciones</h5>
      <div class="rack" id="rackHabitaciones"></div>
    </div>
  `;
  await generarHabitaciones();
}

async function generarHabitaciones() {
    try {
        const response = await fetch(`${API_BASE_URL}/habitaciones`);
        if (!response.ok) throw new Error('Error al obtener las habitaciones');
        const habitaciones = await response.json();
        const rack = document.getElementById('rackHabitaciones');
        rack.innerHTML = habitaciones.map(h => `
            <div class="habitacion ${h.estado}">
                <div>Hab. ${h.numero}</div>
                <small>${h.estado.toUpperCase()}</small>
            </div>
        `).join("");
    } catch (error) {
        console.error(error);
        const rack = document.getElementById('rackHabitaciones');
        rack.innerHTML = `<p class="text-danger">No se pudieron cargar las habitaciones.</p>`;
    }
}

/* ==========================================================
   MÓDULO DE RESERVAS
========================================================== */
function cargarReservas() {
  contenedor.innerHTML = `
    <div class="modulo">
      <h2 class="section-title">📅 Módulo de Reservas</h2>

      <!-- FORMULARIO DE RESERVA -->
      <form id="formReserva" class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Cliente</label>
          <select class="form-select" id="clienteId" required></select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Fecha de llegada</label>
          <input type="date" class="form-control" id="fechaLlegada" required>
        </div>
        <div class="col-md-3">
          <label class="form-label">Fecha de salida</label>
          <input type="date" class="form-control" id="fechaSalida" required>
        </div>
        <div class="col-md-4">
          <label class="form-label">Tipo de habitación</label>
          <select class="form-select" id="tipoHabitacion"></select>
        </div>
        <div class="col-md-4">
          <label class="form-label">Habitación</label>
          <select class="form-select" id="habitacionId"></select>
        </div>
        <div class="col-12">
          <button type="submit" class="btn btn-primary">Guardar Reserva</button>
        </div>
      </form>

      <hr>

      <!-- TABLA DE RESERVAS -->
      <h5>Reservas Registradas</h5>
      <table class="table table-bordered table-hover mt-3">
        <thead class="table-light">
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
        <tbody id="tablaReservas"></tbody>
      </table>
    </div>
  `;

  document.getElementById("formReserva").addEventListener("submit", guardarReserva);
  cargarDatosReservas();
  mostrarReservas();
}

async function cargarDatosReservas() {
    try {
        const [clientesRes, habitacionesRes, tiposRes] = await Promise.all([
            fetch(`${API_BASE_URL}/clientes`),
            fetch(`${API_BASE_URL}/habitaciones`),
            fetch(`${API_BASE_URL}/tipos-habitacion`)
        ]);

        const clientes = await clientesRes.json();
        const habitaciones = await habitacionesRes.json();
        const tipos = await tiposRes.json();

        const clienteSelect = document.getElementById('clienteId');
        clienteSelect.innerHTML = clientes.map(c => `<option value="${c.id}">${c.nombre} ${c.apellido}</option>`).join('');

        const tipoHabitacionSelect = document.getElementById('tipoHabitacion');
        tipoHabitacionSelect.innerHTML = `<option value="">Todos</option>` + tipos.map(t => `<option value="${t.id}">${t.nombre}</option>`).join('');

        const habitacionSelect = document.getElementById('habitacionId');
        habitacionSelect.innerHTML = habitaciones.map(h => `<option value="${h.id}">${h.numero} (${h.tipoHabitacionNombre})</option>`).join('');

    } catch (error) {
        console.error('Error cargando datos para reservas:', error);
    }
}

async function guardarReserva(e) {
  e.preventDefault();

  const nuevaReserva = {
    clienteId: document.getElementById("clienteId").value,
    habitacionId: document.getElementById("habitacionId").value,
    fechaLlegada: document.getElementById("fechaLlegada").value,
    fechaSalida: document.getElementById("fechaSalida").value,
    estado: 'pendiente'
  };

  try {
    const response = await fetch(`${API_BASE_URL}/reservaciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaReserva)
    });
    if (!response.ok) throw new Error('Error al guardar la reserva');

    alert("✅ Reserva guardada correctamente");
    mostrarReservas();
    document.getElementById("formReserva").reset();
  } catch (error) {
      console.error(error);
      alert('No se pudo guardar la reserva.');
  }
}

async function mostrarReservas() {
    try {
        const response = await fetch(`${API_BASE_URL}/reservaciones`);
        if (!response.ok) throw new Error('Error al obtener las reservas');
        const reservaciones = await response.json();
        const tabla = document.getElementById("tablaReservas");

        tabla.innerHTML = reservaciones.map(r => `
            <tr>
                <td>${r.id}</td>
                <td>${r.clienteNombre}</td>
                <td>${r.fechaLlegada}</td>
                <td>${r.fechaSalida}</td>
                <td>${r.habitacionNumero}</td>
                <td>${r.estado}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="eliminarReserva(${r.id})">Eliminar</button>
                </td>
            </tr>
        `).join("");
    } catch (error) {
        console.error(error);
        alert('No se pudieron cargar las reservas.');
    }
}

async function eliminarReserva(id) {
    if (!confirm('¿Está seguro de que desea eliminar esta reserva?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/reservaciones/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error al eliminar la reserva');
        mostrarReservas();
    } catch (error) {
        console.error(error);
        alert('No se pudo eliminar la reserva.');
    }
}

/* ==========================================================
   MÓDULOS RESTANTES (placeholders)
========================================================== */
function cargarCheckIn() {
  contenedor.innerHTML = `
    <div class="modulo">
      <h2 class="section-title">🧳 Módulo de Check-In</h2>
      <p class="mb-3">Selecciona una reserva para realizar el registro de entrada.</p>

      <table class="table table-hover table-bordered">
        <thead class="table-light">
          <tr>
            <th>ID Reserva</th>
            <th>Huésped</th>
            <th>Llegada</th>
            <th>Salida</th>
            <th>Habitación</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody id="tablaCheckIn"></tbody>
      </table>

      <!-- Modal de Asignación -->
      <div class="modal fade" id="modalAsignar" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title">Asignar Habitación</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <p id="reservaSeleccionada"></p>
              <label for="habitacionSelect" class="form-label">Seleccionar habitación libre</label>
              <select id="habitacionSelect" class="form-select"></select>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button class="btn btn-success" onclick="confirmarCheckIn()">Confirmar Check-In</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  mostrarReservasPendientes();
}

async function mostrarReservasPendientes() {
    try {
        const response = await fetch(`${API_BASE_URL}/reservaciones`);
        if (!response.ok) throw new Error('Error al obtener las reservas');
        const reservaciones = await response.json();

        const pendientes = reservaciones.filter(r => r.estado === 'pendiente');

        const tabla = document.getElementById("tablaCheckIn");
        tabla.innerHTML = pendientes.length
            ? pendientes.map(r => `
              <tr>
                <td>${r.id}</td>
                <td>${r.clienteNombre}</td>
                <td>${r.fechaLlegada}</td>
                <td>${r.fechaSalida}</td>
                <td>${r.habitacionNumero}</td>
                <td><button class="btn btn-sm btn-primary" onclick="abrirAsignacion(${r.id})">Asignar</button></td>
              </tr>
            `).join("")
            : `<tr><td colspan="6" class="text-center text-muted">No hay reservas pendientes.</td></tr>`;
    } catch (error) {
        console.error(error);
        alert('No se pudieron cargar las reservas pendientes.');
    }
}

let reservaActual = null;

async function abrirAsignacion(idReserva) {
    try {
        const [reservaRes, habitacionesRes] = await Promise.all([
            fetch(`${API_BASE_URL}/reservaciones/${idReserva}`),
            fetch(`${API_BASE_URL}/habitaciones`)
        ]);

        if (!reservaRes.ok || !habitacionesRes.ok) throw new Error('Error al cargar datos para asignación');

        reservaActual = await reservaRes.json();
        const habitaciones = await habitacionesRes.json();

        document.getElementById("reservaSeleccionada").innerText =
            `Reserva #${reservaActual.id} - Huésped: ${reservaActual.clienteNombre}`;

        const habitacionesLibres = habitaciones.filter(h => h.estado === 'disponible');

        const select = document.getElementById("habitacionSelect");
        select.innerHTML = habitacionesLibres.map(h => `
            <option value="${h.id}">${h.numero} (${h.tipoHabitacionNombre})</option>
        `).join("");

        const modal = new bootstrap.Modal(document.getElementById("modalAsignar"));
        modal.show();
    } catch (error) {
        console.error(error);
        alert('No se pudo abrir el modal de asignación.');
    }
}

async function confirmarCheckIn() {
    const habitacionId = document.getElementById("habitacionSelect").value;
    if (!reservaActual || !habitacionId) {
        alert('Debe seleccionar una reserva y una habitación.');
        return;
    }

    const checkInData = {
        reservacionId: reservaActual.id,
        habitacionId: habitacionId,
        clienteId: reservaActual.clienteId,
        fechaCheckIn: new Date().toISOString(),
        estado: 'activa'
    };

    try {
        // Crear la estancia (Check-in)
        const estanciaRes = await fetch(`${API_BASE_URL}/estancias`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(checkInData)
        });
        if (!estanciaRes.ok) throw new Error('Error al realizar el check-in');

        // Actualizar estado de la habitación a 'ocupada'
        const habitacionRes = await fetch(`${API_BASE_URL}/habitaciones/${habitacionId}`);
        const habitacion = await habitacionRes.json();
        habitacion.estado = 'ocupada';

        const updateHabitacionRes = await fetch(`${API_BASE_URL}/habitaciones/${habitacionId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(habitacion)
        });
        if (!updateHabitacionRes.ok) throw new Error('Error al actualizar el estado de la habitación');
        
        // Actualizar estado de la reservacion a 'confirmada'
        reservaActual.estado = 'confirmada';
        const updateReservaRes = await fetch(`${API_BASE_URL}/reservaciones/${reservaActual.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reservaActual)
        });
        if (!updateReservaRes.ok) throw new Error('Error al actualizar el estado de la reservación');


        alert(`✅ Check-In realizado correctamente\nHuésped: ${reservaActual.clienteNombre}\nHab. ${habitacion.numero}`);
        mostrarReservasPendientes();

        const modal = bootstrap.Modal.getInstance(document.getElementById("modalAsignar"));
        modal.hide();
    } catch (error) {
        console.error(error);
        alert('No se pudo confirmar el check-in.');
    }
}
function cargarFolio() {
  contenedor.innerHTML = `
    <div class="modulo">
      <h2 class="section-title">💵 Módulo de Folio (Cuenta del Huésped)</h2>
      <p class="text-muted mb-3">Selecciona un huésped activo para ver y administrar su cuenta.</p>

      <div class="row mb-4">
        <div class="col-md-6">
          <label class="form-label">Huésped activo</label>
          <select id="selectHuesped" class="form-select" onchange="mostrarFolio()"></select>
        </div>
      </div>

      <div id="folioDetalle" class="d-none">
        <hr>
        <h4 id="nombreHuesped"></h4>
        <p><strong>Habitación:</strong> <span id="habitacionFolio"></span></p>
        <p><strong>Fechas:</strong> <span id="fechasFolio"></span></p>

        <!-- TABLA DE CARGOS -->
        <h5 class="mt-4">🧾 Cargos y Pagos</h5>
        <table class="table table-sm table-striped mt-2">
          <thead class="table-light">
            <tr>
              <th>Descripción</th>
              <th>Monto (USD)</th>
              <th>Fecha</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody id="tablaCargos"></tbody>
        </table>

        <!-- BOTONES DE ACCIÓN -->
        <div class="d-flex gap-2 mt-3">
          <button class="btn btn-success" onclick="abrirModalCargo()">+ Agregar Cargo</button>
        </div>

        <hr>
        <h4>Total: <span id="totalCargos" class="text-danger"></span></h4>
      </div>
    </div>
    
    <!-- Modal para agregar cargo -->
    <div class="modal fade" id="modalCargo" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Agregar Cargo</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="formCargo">
                        <div class="mb-3">
                            <label for="servicioCargo" class="form-label">Servicio</label>
                            <select id="servicioCargo" class="form-select" required></select>
                        </div>
                        <div class="mb-3">
                            <label for="cantidadCargo" class="form-label">Cantidad</label>
                            <input type="number" id="cantidadCargo" class="form-control" min="1" value="1" required>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" onclick="agregarCargo()">Guardar Cargo</button>
                </div>
            </div>
        </div>
    </div>
  `;

  cargarHuespedesActivos();
}

async function cargarHuespedesActivos() {
    try {
        const response = await fetch(`${API_BASE_URL}/estancias`);
        if (!response.ok) throw new Error('Error al obtener las estancias');
        const estancias = await response.json();
        const activos = estancias.filter(e => e.estado === 'activa');

        const select = document.getElementById("selectHuesped");

        if (activos.length === 0) {
            select.innerHTML = `<option>No hay huéspedes activos</option>`;
        } else {
            select.innerHTML = `<option value="">-- Selecciona un huésped --</option>` +
                activos.map(h => `<option value="${h.id}">${h.clienteNombre} (Hab. ${h.habitacionNumero})</option>`).join("");
        }
    } catch (error) {
        console.error(error);
        alert('No se pudieron cargar los huéspedes activos.');
    }
}

async function mostrarFolio() {
  const estanciaId = document.getElementById("selectHuesped").value;
  if (!estanciaId) {
      document.getElementById("folioDetalle").classList.add("d-none");
      return;
  };

  try {
    const [estanciaRes, folioRes] = await Promise.all([
        fetch(`${API_BASE_URL}/estancias/${estanciaId}`),
        fetch(`${API_BASE_URL}/folios/estancia/${estanciaId}`)
    ]);

    if (!estanciaRes.ok || !folioRes.ok) throw new Error('Error al cargar datos del folio');

    const estancia = await estanciaRes.json();
    const folio = await folioRes.json();

    document.getElementById("folioDetalle").classList.remove("d-none");
    document.getElementById("nombreHuesped").innerText = `Huésped: ${estancia.clienteNombre}`;
    document.getElementById("habitacionFolio").innerText = estancia.habitacionNumero;
    document.getElementById("fechasFolio").innerText = `${new Date(estancia.fechaCheckIn).toLocaleDateString()} → ${estancia.fechaCheckOut ? new Date(estancia.fechaCheckOut).toLocaleDateString() : 'Presente'}`;

    const tabla = document.getElementById("tablaCargos");
    tabla.innerHTML = folio.cargos.length
        ? folio.cargos.map(c => `
          <tr>
            <td>${c.servicioNombre}</td>
            <td>$${c.subtotal.toFixed(2)}</td>
            <td>${new Date(c.fecha).toLocaleString()}</td>
            <td><button class="btn btn-sm btn-outline-danger" onclick="eliminarCargo(${c.id})">X</button></td>
          </tr>
        `).join("")
        : `<tr><td colspan="4" class="text-center text-muted">No hay movimientos registrados.</td></tr>`;

    document.getElementById("totalCargos").innerText = `$${folio.total.toFixed(2)}`;
  } catch (error) {
      console.error(error);
      alert('No se pudo mostrar el folio.');
  }
}

async function abrirModalCargo() {
    const estanciaId = document.getElementById("selectHuesped").value;
    if (!estanciaId) {
        alert("Seleccione un huésped activo.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/servicios`);
        if (!response.ok) throw new Error('Error al obtener los servicios');
        const servicios = await response.json();

        const select = document.getElementById("servicioCargo");
        select.innerHTML = servicios.map(s => `<option value="${s.id}" data-precio="${s.precio}">${s.nombre} ($${s.precio})</option>`).join('');

        const modal = new bootstrap.Modal(document.getElementById("modalCargo"));
        modal.show();
    } catch (error) {
        console.error(error);
        alert('No se pudieron cargar los servicios.');
    }
}

async function agregarCargo() {
  const estanciaId = document.getElementById("selectHuesped").value;
  const servicioSelect = document.getElementById("servicioCargo");
  const servicioId = servicioSelect.value;
  const cantidad = parseInt(document.getElementById("cantidadCargo").value);
  const precio = parseFloat(servicioSelect.options[servicioSelect.selectedIndex].dataset.precio);

  if (!estanciaId || !servicioId || isNaN(cantidad) || cantidad <= 0) {
    alert("Datos inválidos.");
    return;
  }
    
  const folioRes = await fetch(`${API_BASE_URL}/folios/estancia/${estanciaId}`);
  const folio = await folioRes.json();

  const nuevoCargo = {
    folioId: folio.id,
    servicioId: servicioId,
    cantidad: cantidad,
    subtotal: cantidad * precio,
    fecha: new Date().toISOString()
  };

  try {
    const response = await fetch(`${API_BASE_URL}/folios/cargos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoCargo)
    });
    if (!response.ok) throw new Error('Error al agregar el cargo');

    const modal = bootstrap.Modal.getInstance(document.getElementById("modalCargo"));
    modal.hide();
    mostrarFolio();
  } catch (error) {
    console.error(error);
    alert('No se pudo agregar el cargo.');
  }
}

async function eliminarCargo(cargoId) {
    if (!confirm('¿Está seguro de que desea eliminar este cargo?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/folios/cargos/${cargoId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error al eliminar el cargo');
        mostrarFolio();
    } catch (error) {
        console.error(error);
        alert('No se pudo eliminar el cargo.');
    }
}
function cargarCheckOut() {
  contenedor.innerHTML = `
    <div class="modulo">
      <h2 class="section-title">🚪 Módulo de Check-Out</h2>
      <p class="text-muted">Selecciona un huésped activo para procesar su salida.</p>

      <div class="row mb-4">
        <div class="col-md-6">
          <label class="form-label">Huésped activo</label>
          <select id="selectCheckOut" class="form-select" onchange="mostrarResumenCheckout()"></select>
        </div>
      </div>

      <div id="resumenCheckout" class="d-none">
        <hr>
        <h4 id="nombreCheckout"></h4>
        <p><strong>Habitación:</strong> <span id="habCheckout"></span></p>
        <p><strong>Fechas:</strong> <span id="fechasCheckout"></span></p>
        <h5 class="mt-3">💵 Estado de Cuenta</h5>
        <p><strong>Saldo Actual:</strong> <span id="saldoCheckout" class="fw-bold"></span></p>

        <div class="mt-4 d-flex gap-2">
          <button class="btn btn-info" onclick="verFolioDesdeCheckout()">Ver Folio</button>
          <button class="btn btn-success" onclick="confirmarCheckout()">Confirmar Check-Out</button>
        </div>
      </div>
    </div>
  `;

  cargarHuespedesParaCheckout();
}

async function cargarHuespedesParaCheckout() {
    try {
        const response = await fetch(`${API_BASE_URL}/estancias`);
        if (!response.ok) throw new Error('Error al obtener las estancias');
        const estancias = await response.json();
        const activos = estancias.filter(e => e.estado === 'activa');

        const select = document.getElementById("selectCheckOut");

        if (activos.length === 0) {
            select.innerHTML = `<option>No hay huéspedes activos</option>`;
        } else {
            select.innerHTML = `<option value="">-- Selecciona un huésped --</option>` +
                activos.map(h => `<option value="${h.id}">${h.clienteNombre} (Hab. ${h.habitacionNumero})</option>`).join("");
        }
    } catch (error) {
        console.error(error);
        alert('No se pudieron cargar los huéspedes activos.');
    }
}

async function mostrarResumenCheckout() {
  const estanciaId = document.getElementById("selectCheckOut").value;
  if (!estanciaId) {
      document.getElementById("resumenCheckout").classList.add("d-none");
      return;
  };

  try {
    const [estanciaRes, folioRes] = await Promise.all([
        fetch(`${API_BASE_URL}/estancias/${estanciaId}`),
        fetch(`${API_BASE_URL}/folios/estancia/${estanciaId}`)
    ]);

    if (!estanciaRes.ok || !folioRes.ok) throw new Error('Error al cargar datos del checkout');

    const estancia = await estanciaRes.json();
    const folio = await folioRes.json();

    document.getElementById("resumenCheckout").classList.remove("d-none");
    document.getElementById("nombreCheckout").innerText = `Huésped: ${estancia.clienteNombre}`;
    document.getElementById("habCheckout").innerText = estancia.habitacionNumero;
    document.getElementById("fechasCheckout").innerText = `${new Date(estancia.fechaCheckIn).toLocaleDateString()} → ${estancia.fechaCheckOut ? new Date(estancia.fechaCheckOut).toLocaleDateString() : 'Presente'}`;
    
    const saldoSpan = document.getElementById("saldoCheckout");
    saldoSpan.innerText = `$${folio.total.toFixed(2)}`;
    saldoSpan.classList.toggle("text-danger", folio.total > 0);
    saldoSpan.classList.toggle("text-success", folio.total === 0);

  } catch (error) {
      console.error(error);
      alert('No se pudo mostrar el resumen del checkout.');
  }
}

function verFolioDesdeCheckout() {
  mostrarVista("folio");
  setTimeout(() => {
    const select = document.getElementById("selectHuesped");
    const id = document.getElementById("selectCheckOut").value;
    if (select && id) {
      select.value = id;
      mostrarFolio();
    }
  }, 300);
}

async function confirmarCheckout() {
    const estanciaId = document.getElementById("selectCheckOut").value;
    if (!estanciaId) {
        alert("Seleccione un huésped primero.");
        return;
    }

    try {
        const folioRes = await fetch(`${API_BASE_URL}/folios/estancia/${estanciaId}`);
        const folio = await folioRes.json();

        if (folio.total > 0) {
            return alert("⚠️ No se puede realizar el Check-Out. El saldo no está en cero.");
        }

        const estanciaRes = await fetch(`${API_BASE_URL}/estancias/${estanciaId}`);
        const estancia = await estanciaRes.json();

        estancia.estado = 'finalizada';
        estancia.fechaCheckOut = new Date().toISOString();

        const updateEstanciaRes = await fetch(`${API_BASE_URL}/estancias/${estanciaId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(estancia)
        });
        if (!updateEstanciaRes.ok) throw new Error('Error al actualizar la estancia');

        const habitacionRes = await fetch(`${API_BASE_URL}/habitaciones/${estancia.habitacionId}`);
        const habitacion = await habitacionRes.json();
        habitacion.estado = 'limpieza';

        const updateHabitacionRes = await fetch(`${API_BASE_URL}/habitaciones/${estancia.habitacionId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(habitacion)
        });
        if (!updateHabitacionRes.ok) throw new Error('Error al actualizar la habitación');

        alert(`✅ Check-Out realizado con éxito.\nHabitación ${habitacion.numero} marcada como "limpieza".`);
        cargarCheckOut();

    } catch (error) {
        console.error(error);
        alert('No se pudo confirmar el check-out.');
    }
}
function cargarAmaLlaves() {
  contenedor.innerHTML = `
    <div class="modulo">
      <h2 class="section-title">🧹 Módulo de Ama de Llaves</h2>

      <div class="mb-3">
        <label class="form-label">Filtrar por Estado:</label>
        <select id="filtroEstado" class="form-select w-auto d-inline-block" onchange="mostrarHabitacionesAma()">
          <option value="todos">Todos</option>
          <option value="disponible">Disponible</option>
          <option value="ocupada">Ocupada</option>
          <option value="limpieza">Limpieza</option>
          <option value="mantenimiento">Mantenimiento</option>
        </select>
      </div>

      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th>Número</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody id="tablaAma"></tbody>
      </table>
    </div>
  `;

  mostrarHabitacionesAma();
}

async function mostrarHabitacionesAma() {
    try {
        const response = await fetch(`${API_BASE_URL}/habitaciones`);
        if (!response.ok) throw new Error('Error al obtener las habitaciones');
        const habitaciones = await response.json();

        const filtro = document.getElementById("filtroEstado").value;
        const filtradas = filtro === "todos" ? habitaciones : habitaciones.filter(h => h.estado === filtro);

        const tabla = document.getElementById("tablaAma");
        tabla.innerHTML = filtradas.length
            ? filtradas.map(h => `
                <tr>
                  <td>${h.numero}</td>
                  <td>${h.tipoHabitacionNombre}</td>
                  <td><span class="badge bg-${colorEstado(h.estado)}">${h.estado}</span></td>
                  <td>
                    <button class="btn btn-sm btn-outline-success" onclick="cambiarEstado(${h.id}, 'disponible')">Marcar Disponible</button>
                    <button class="btn btn-sm btn-outline-warning" onclick="cambiarEstado(${h.id}, 'mantenimiento')">Marcar Mantenimiento</button>
                  </td>
                </tr>
              `).join("")
            : `<tr><td colspan="4" class="text-center text-muted">No hay habitaciones con ese estado.</td></tr>`;
    } catch (error) {
        console.error(error);
        alert('No se pudieron cargar las habitaciones.');
    }
}

function colorEstado(estado) {
  switch (estado) {
    case "disponible": return "success";
    case "ocupada": return "secondary";
    case "limpieza": return "danger";
    case "mantenimiento": return "warning";
    default: return "light";
  }
}

async function cambiarEstado(id, nuevoEstado) {
    if (!confirm(`¿Está seguro de cambiar el estado de la habitación a "${nuevoEstado}"?`)) return;

    try {
        const habitacionRes = await fetch(`${API_BASE_URL}/habitaciones/${id}`);
        if (!habitacionRes.ok) throw new Error('Error al obtener la habitación');
        const habitacion = await habitacionRes.json();

        habitacion.estado = nuevoEstado;

        const updateHabitacionRes = await fetch(`${API_BASE_URL}/habitaciones/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(habitacion)
        });
        if (!updateHabitacionRes.ok) throw new Error('Error al actualizar la habitación');

        alert(`Habitación ${habitacion.numero} actualizada a "${nuevoEstado}".`);
        mostrarHabitacionesAma();
    } catch (error) {
        console.error(error);
        alert('No se pudo cambiar el estado de la habitación.');
    }
}
function cargarReportes() {
  contenedor.innerHTML = `
    <div class="modulo">
      <h2 class="section-title">📊 Reportes y Estadísticas</h2>

      <div class="row text-center mb-4">
        <div class="col-md-4">
          <div class="card border-success">
            <div class="card-body">
              <h5 class="card-title text-success">Ocupación Actual</h5>
              <h3 id="repOcupacion"></h3>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-warning">
            <div class="card-body">
              <h5 class="card-title text-warning">Habitaciones por Estado</h5>
              <p id="repEstados"></p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-primary">
            <div class="card-body">
              <h5 class="card-title text-primary">Ingresos Totales</h5>
              <h3 id="repIngresos"></h3>
            </div>
          </div>
        </div>
      </div>

      <hr>
      <h5>Historial de Check-Outs</h5>
      <table class="table table-sm table-striped mt-2">
        <thead class="table-light">
          <tr><th>Huésped</th><th>Hab.</th><th>Salida</th></tr>
        </thead>
        <tbody id="tablaHistorial"></tbody>
      </table>
    </div>
  `;

  generarReportes();
}

async function generarReportes() {
    try {
        const [habitacionesRes, estanciasRes, foliosRes] = await Promise.all([
            fetch(`${API_BASE_URL}/habitaciones`),
            fetch(`${API_BASE_URL}/estancias`),
            fetch(`${API_BASE_URL}/folios`)
        ]);

        if (!habitacionesRes.ok || !estanciasRes.ok || !foliosRes.ok) throw new Error('Error al cargar datos para reportes');

        const habitaciones = await habitacionesRes.json();
        const estancias = await estanciasRes.json();
        const folios = await foliosRes.json();

        // --- Ocupación ---
        const ocupadas = habitaciones.filter(h => h.estado === "ocupada").length;
        const totalHabitaciones = habitaciones.length || 1;
        const porcentaje = ((ocupadas / totalHabitaciones) * 100).toFixed(1);
        document.getElementById("repOcupacion").innerText = `${porcentaje}% (${ocupadas}/${totalHabitaciones})`

        // --- Estados ---
        const estados = habitaciones.reduce((acc, h) => {
            acc[h.estado] = (acc[h.estado] || 0) + 1;
            return acc;
        }, {});
        document.getElementById("repEstados").innerText = Object.entries(estados)
            .map(([estado, cant]) => `${estado}: ${cant}`).join(", ");

        // --- Ingresos ---
        const ingresos = folios.reduce((total, folio) => total + folio.total, 0);
        document.getElementById("repIngresos").innerText = `$${ingresos.toFixed(2)}`;

        // --- Historial ---
        const historial = estancias.filter(e => e.estado === 'finalizada');
        const tabla = document.getElementById("tablaHistorial");
        tabla.innerHTML = historial.length
            ? historial.map(h => `
                <tr>
                  <td>${h.clienteNombre}</td><td>${h.habitacionNumero}</td>
                  <td>${new Date(h.fechaCheckOut).toLocaleDateString()}</td>
                </tr>`).join("")
            : `<tr><td colspan="3" class="text-center text-muted">No hay registros aún.</td></tr>`;

    } catch (error) {
        console.error(error);
        alert('No se pudieron generar los reportes.');
    }
}

/* ==========================================================
   MÓDULO: CONFIGURACIÓN DEL SISTEMA
========================================================== */
function cargarConfiguracion() {
  contenedor.innerHTML = `
    <div class="modulo">
      <h2 class="section-title">⚙️ Configuración del Sistema</h2>
      <ul class="nav nav-tabs mb-4" id="configTabs">
        <li class="nav-item"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#hab">Habitaciones</button></li>
        <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tipos">Tipos de Habitación</button></li>
      </ul>

      <div class="tab-content">
        <!-- TAB 1: HABITACIONES -->
        <div class="tab-pane fade show active" id="hab">
          <h5>Gestión de Habitaciones</h5>
          <form id="formHab" class="row g-3 mb-3">
            <div class="col-md-3">
              <input type="text" class="form-control" id="numHab" placeholder="Número" required>
            </div>
            <div class="col-md-4">
              <select class="form-select" id="tipoHab" required></select>
            </div>
            <div class="col-md-3">
              <select class="form-select" id="estadoHab">
                <option>disponible</option>
                <option>ocupada</option>
                <option>limpieza</option>
                <option>mantenimiento</option>
              </select>
            </div>
            <div class="col-md-2">
              <button type="submit" class="btn btn-success w-100">Agregar</button>
            </div>
          </form>

          <table class="table table-striped table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>Número</th><th>Tipo</th><th>Estado</th><th>Acción</th>
              </tr>
            </thead>
            <tbody id="tablaHab"></tbody>
          </table>
        </div>

        <!-- TAB 2: TIPOS DE HABITACIÓN -->
        <div class="tab-pane fade" id="tipos">
          <h5>Tipos de Habitación</h5>
          <form id="formTipo" class="row g-3 mb-3">
            <div class="col-md-4">
              <input type="text" class="form-control" id="nombreTipo" placeholder="Ej. Simple, Doble..." required>
            </div>
            <div class="col-md-3">
              <input type="number" class="form-control" id="capacidadTipo" placeholder="Capacidad" required>
            </div>
            <div class="col-md-3">
              <input type="number" class="form-control" id="precioTipo" placeholder="Precio" required>
            </div>
            <div class="col-md-2">
              <button type="submit" class="btn btn-success w-100">Agregar Tipo</button>
            </div>
          </form>

          <ul id="listaTipos" class="list-group"></ul>
        </div>
      </div>
    </div>
  `;

  document.getElementById("formHab").addEventListener("submit", agregarHabitacion);
  document.getElementById("formTipo").addEventListener("submit", agregarTipo);

  mostrarTipos();
  mostrarHabitaciones();
}

/* ---------- Tipos de Habitación ---------- */
async function mostrarTipos() {
  try {
    const response = await fetch(`${API_BASE_URL}/tipos-habitacion`);
    if (!response.ok) throw new Error('Error al obtener los tipos de habitación');
    const tipos = await response.json();

    const lista = document.getElementById("listaTipos");
    const selectTipoHab = document.getElementById("tipoHab");

    lista.innerHTML = tipos.map(t =>
      `<li class="list-group-item d-flex justify-content-between align-items-center">
        ${t.nombre} (Cap: ${t.capacidad}, Precio: $${t.precio})
        <button class="btn btn-sm btn-outline-danger" onclick="eliminarTipo(${t.id})">Eliminar</button>
      </li>`
    ).join("");

    selectTipoHab.innerHTML = tipos.map(t => `<option value="${t.id}">${t.nombre}</option>`).join("");
  } catch (error) {
    console.error(error);
    alert('No se pudieron cargar los tipos de habitación.');
  }
}

async function agregarTipo(e) {
  e.preventDefault();
  const nuevoTipo = {
    nombre: document.getElementById("nombreTipo").value.trim(),
    descripcion: "", // Opcional, se puede agregar un campo en el form
    capacidad: parseInt(document.getElementById("capacidadTipo").value),
    precio: parseFloat(document.getElementById("precioTipo").value)
  };

  if (!nuevoTipo.nombre || isNaN(nuevoTipo.capacidad) || isNaN(nuevoTipo.precio)) {
    alert('Por favor, complete todos los campos del tipo de habitación.');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/tipos-habitacion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoTipo)
    });
    if (!response.ok) throw new Error('Error al agregar el tipo de habitación');

    document.getElementById("formTipo").reset();
    mostrarTipos();
  } catch (error) {
    console.error(error);
    alert('No se pudo agregar el tipo de habitación.');
  }
}

async function eliminarTipo(id) {
  if (!confirm('¿Está seguro de que desea eliminar este tipo de habitación?')) return;

  try {
    const response = await fetch(`${API_BASE_URL}/tipos-habitacion/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error al eliminar el tipo de habitación');
    mostrarTipos();
  } catch (error) {
    console.error(error);
    alert('No se pudo eliminar el tipo de habitación.');
  }
}

/* ---------- Habitaciones ---------- */
async function mostrarHabitaciones() {
    try {
        const response = await fetch(`${API_BASE_URL}/habitaciones`);
        if (!response.ok) throw new Error('Error al obtener las habitaciones');
        const habitaciones = await response.json();

        const tabla = document.getElementById("tablaHab");
        tabla.innerHTML = habitaciones.map(h =>
            `<tr>
                <td>${h.numero}</td>
                <td>${h.tipoHabitacionNombre}</td>
                <td>${h.estado}</td>
                <td><button class="btn btn-sm btn-outline-danger" onclick="eliminarHabitacion(${h.id})">Eliminar</button></td>
            </tr>`
        ).join("");
    } catch (error) {
        console.error(error);
        alert('No se pudieron cargar las habitaciones.');
    }
}

async function agregarHabitacion(e) {
    e.preventDefault();
    const nuevaHabitacion = {
        numero: document.getElementById("numHab").value,
        tipoHabitacionId: document.getElementById("tipoHab").value,
        estado: document.getElementById("estadoHab").value
    };

    if (!nuevaHabitacion.numero || !nuevaHabitacion.tipoHabitacionId) {
        alert('Por favor, complete todos los campos de la habitación.');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/habitaciones`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaHabitacion)
        });
        if (!response.ok) throw new Error('Error al agregar la habitación');

        document.getElementById("formHab").reset();
        mostrarHabitaciones();
    } catch (error) {
        console.error(error);
        alert('No se pudo agregar la habitación.');
    }
}

async function eliminarHabitacion(id) {
    if (!confirm('¿Está seguro de que desea eliminar esta habitación?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/habitaciones/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error al eliminar la habitación');
        mostrarHabitaciones();
    } catch (error) {
        console.error(error);
        alert('No se pudo eliminar la habitación.');
    }
}

/* ==========================================================
   INICIALIZACIÓN
========================================================== */
mostrarVista("dashboard");