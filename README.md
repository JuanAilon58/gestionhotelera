# Gestión Hotelera

Este es un sistema de gestión hotelera con un backend desarrollado en Java (Spring Boot) y un frontend en React.

# COLABORADORES  
   * Juan Ailón Ortíz     0904-21-7685
   * Allan Roberto López Féñix 0904-22-8732

## Características Principales

Este sistema permite una administración integral de las operaciones de un hotel, incluyendo:

* **Gestión de Reservas:**
    * Crear, consultar, actualizar y eliminar reservas.
    * Búsqueda avanzada de reservas (por fechas, por huésped o por estado).
    * Asignación de habitaciones a las reservas.

* **Gestión de Huéspedes:**
    * Registro y administración de la información de los huéspedes (CRUD).
    * Mantenimiento de un historial de estancias por huésped.

* **Gestión de Habitaciones:**
    * Creación y administración de habitaciones (número, precio, capacidad).
    * Gestión de *tipos* de habitación (ej. Sencilla, Doble, Suite).
    * Visualización y actualización del estado de la habitación (ej. Disponible, Ocupada, Mantenimiento, Limpieza).

* **Flujo de Estancia (Check-in / Check-out):**
    * Proceso de Check-in para huéspedes con reserva.
    * Proceso de Check-out al finalizar la estancia.

## Tecnologías Utilizadas

Este proyecto fue construido utilizando las siguientes tecnologías:

### Backend
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white)

### Frontend
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

### Base de Datos
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

---

## Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu sistema:

* **Java Development Kit (JDK):** Versión 17 o superior.
* **Maven:** Utilizado para la gestión de dependencias. Puedes usar el Maven Wrapper (`mvnw`) incluido.
* **Node.js y npm:** Para gestionar las dependencias y ejecutar el frontend de React.
* **Base de Datos:** El proyecto está configurado para **PostgreSQL**. Asegúrate de tenerla instalada y en ejecución.

## ⚙️ Configuración

1.  Clona el repositorio:
    ```bash
    git clone https://github.com/JuanAilon58/gestionhotelera.git
    cd gestionhotelera
    ```

2.  Configura la Base de Datos:
    * Crea una base de datos en PostgreSQL con el nombre `gestionhotelera`.
    * Edita el archivo `src/main/resources/application.properties` para configurar la URL de la base de datos, el nombre de usuario y la contraseña según tu entorno local:

    ```properties
    spring.datasource.url=jdbc:postgresql://localhost:5432/gestionhotelera
    spring.datasource.username=tu_usuario
    spring.datasource.password=tu_contraseña
    spring.jpa.hibernate.ddl-auto=update
    ```

## Instalación y Ejecución

Debes ejecutar el backend y el frontend en terminales separadas.

### Backend (Spring Boot)

1.  Navega a la raíz del proyecto (donde está el archivo `mvnw`).
2.  Ejecuta la aplicación:

    * En Windows:
        ```bash
        .\mvnw spring-boot:run
        ```
    * En macOS/Linux:
        ```bash
        ./mvnw spring-boot:run
        ```
    
    El servidor backend se iniciará en `http://localhost:8080`.

### Frontend (React)

1.  Abre una nueva terminal y navega al directorio del frontend:
    ```bash
    cd frontend-react
    ```

2.  Instala las dependencias:
    ```bash
    npm install
    ```

3.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```
    
    La aplicación de React se abrirá en `http://localhost:5173` (o el puerto que se indique en la terminal).

---
