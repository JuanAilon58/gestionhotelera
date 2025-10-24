
# Análisis y Plan de Mejora: Proyecto "hotel-sistema"

## Resumen Ejecutivo

El proyecto `hotel-sistema` es un prototipo funcional para la gestión hotelera. La base del código utiliza HTML, Bootstrap 5 y JavaScript del lado del cliente, con `localStorage` como base de datos.

Si bien la aplicación presenta una interfaz funcional para varias tareas, sufre de **bugs críticos, vulnerabilidades de seguridad y problemas arquitectónicos** que impiden su escalabilidad y mantenimiento. Este reporte detalla los hallazgos y propone un plan de acción para solucionarlos.

---

## 1. Bugs Críticos y Errores Funcionales

Estos son problemas que causan un comportamiento incorrecto o inesperado en la aplicación.

### 1.1. Redeclaración de Funciones (Bug Crítico)

En `js/app.js`, varias funciones como `cargarCheckIn()` están declaradas dos veces. La segunda declaración sobreescribe a la primera. Esto es un error grave que probablemente surgió al fusionar código.

**Ejemplo del Bug:**
```javascript
// js/app.js

// Primera declaración (placeholder)
function cargarCheckIn(){ contenedor.innerHTML = `<div class='modulo'><h2>🧳 Check-In</h2><p>En desarrollo...</p></div>`; }

// ... más código ...

// Segunda declaración (implementación real)
// ESTA ES LA QUE REALMENTE SE EJECUTA
function cargarCheckIn() {
  contenedor.innerHTML = `
    <div class="modulo">
      <h2 class="section-title">🧳 Módulo de Check-In</h2>
      // ... resto del código
    </div>
  `;
  mostrarReservasPendientes();
}
```
**Impacto:** Alto. Causa confusión y hace que parte del código sea inalcanzable. Dificulta el mantenimiento.

### 1.2. Lógica de Negocio Incompleta o Errónea

- **Check-Out con Saldo Pendiente:** La función `confirmarCheckout` impide la salida si el saldo es mayor a cero, pero no considera saldos negativos (a favor del cliente).
- **Disponibilidad de Habitaciones:** El sistema no valida si una habitación ya está ocupada al hacer un Check-In. Permite asignar una habitación que ya tiene un huésped.
- **Persistencia de Estado:** El estado de las habitaciones en el módulo de "Ama de Llaves" y el estado real (ocupada por un huésped) no están sincronizados. Son dos listas separadas en `localStorage` que no interactúan.

---

## 2. Vulnerabilidades de Seguridad

### 2.1. Cross-Site Scripting (XSS)

La aplicación es **altamente vulnerable a ataques XSS**. Los datos introducidos por el usuario (ej. nombre del huésped) se insertan directamente en el HTML usando `innerHTML` sin ningún tipo de sanitización.

**Ejemplo de Vulnerabilidad:**
Si un usuario crea una reserva con el nombre: `<script>alert('XSS Attack!');</script>`, ese script se ejecutará para cualquier empleado que vea la lista de reservas.

```javascript
// js/app.js - función mostrarReservas()
tabla.innerHTML = reservas.map(r => `
    <tr>
      <td>${r.id}</td>
      <td>${r.nombre}</td> // <-- VULNERABILIDAD AQUÍ
      // ...
    </tr>
`).join("");
```
**Impacto:** Crítico. Un atacante puede robar cookies de sesión, redirigir a los usuarios a sitios maliciosos o modificar el contenido de la página.

---

## 3. Optimizaciones y Mejoras de Arquitectura

Estos cambios mejorarán la mantenibilidad, el rendimiento y la escalabilidad del sistema.

### 3.1. Arquitectura de JavaScript

- **Scope Global:** Todas las variables y funciones residen en el scope global, lo que es una mala práctica. Esto puede causar colisiones de nombres y dificulta la gestión del estado.
- **Separación de Responsabilidades:** El código mezcla la lógica de negocio (manipular `localStorage`), la manipulación del DOM y la renderización de vistas en las mismas funciones.

**Solución Sugerida:**
1.  **Encapsular el código:** Envolver todo el `app.js` en una IIFE (Immediately Invoked Function Expression) para crear un scope privado.
2.  **Crear un "Módulo de Estado":** Centralizar toda la interacción con `localStorage` en un solo objeto o conjunto de funciones. Este módulo sería el único responsable de leer y escribir en la base de datos del navegador.
3.  **Separar Renderizado y Lógica:** Crear funciones específicas para renderizar HTML y otras para manejar eventos y lógica de negocio.

### 3.2. Gestión de Estado en `localStorage`

- **Múltiples Claves:** El uso de muchas claves (`reservas`, `folios`, `huespedesActivos`, etc.) es ineficiente y contamina el `localStorage`.
- **Parseo Constante:** Se llama a `JSON.parse()` y `JSON.stringify()` repetidamente en todo el código.

**Solución Sugerida:**
- Consolidar todo el estado de la aplicación en **un único objeto** en `localStorage`.
  ```javascript
  // Ejemplo de estado centralizado
  const hotelDB = {
    habitaciones: [],
    tipos: [],
    reservas: [],
    huespedesActivos: [],
    folios: {},
    // ...
  };

  // Guardar:
  localStorage.setItem('hotelDB', JSON.stringify(hotelDB));

  // Leer:
  const db = JSON.parse(localStorage.getItem('hotelDB'));
  ```

### 3.3. Manipulación del DOM y Eventos

- **Uso de `innerHTML`:** Reemplazar todo el `innerHTML` del contenedor principal en cada cambio de vista es ineficiente y destruye y vuelve a crear nodos del DOM innecesariamente.
- **`onclick` en HTML:** El uso de atributos `onclick` mezcla HTML y JavaScript, lo cual es una práctica obsoleta y difícil de mantener.

**Solución Sugerida:**
1.  **Delegación de Eventos:** En lugar de añadir un listener a cada botón de "Eliminar" en una tabla, añadir un único listener a la tabla (`<tbody>`). Este listener puede identificar qué botón se presionó y actuar en consecuencia. Esto es mucho más eficiente.
2.  **JavaScript No Intrusivo:** Eliminar todos los `onclick` del HTML y vincular los eventos usando `addEventListener` en `app.js`.

### 3.4. Mejoras en CSS

- **Colores Hardcodeados:** Los colores de estado (`#198754` para libre, `#dc3545` para ocupada) se repiten en el CSS.

**Solución Sugerida:**
- Utilizar **variables CSS** para definir la paleta de colores de estado. Esto facilita el cambio de tema y mantiene la consistencia.
  ```css
  :root {
    --color-libre: #198754;
    --color-ocupada: #dc3545;
    --color-sucia: #ffc107;
    /* ... etc ... */
  }

  .libre { background-color: var(--color-libre); }
  .ocupada { background-color: var(--color-ocupada); }
  ```

## Conclusión y Próximos Pasos

El proyecto es un buen punto de partida, pero requiere una refactorización significativa para ser considerado robusto y seguro.

**Plan de Acción Recomendado:**
1.  **Prioridad Máxima:** Solucionar la vulnerabilidad **XSS** sanitizando todas las entradas del usuario antes de renderizarlas en el DOM.
2.  **Refactorizar el Código JavaScript:**
    -   Eliminar las funciones duplicadas.
    -   Encapsular todo el script en una IIFE.
    -   Centralizar el estado de `localStorage` en un único objeto.
    -   Separar la lógica de la presentación.
3.  **Mejorar la Interfaz de Usuario:** Reemplazar el uso de `prompt()` por modales de Bootstrap para una mejor experiencia de usuario.
4.  **Optimizar CSS y Eventos:** Implementar variables CSS y delegación de eventos.
