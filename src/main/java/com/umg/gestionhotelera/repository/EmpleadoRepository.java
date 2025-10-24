package com.umg.gestionhotelera.repository;

import com.umg.gestionhotelera.entity.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmpleadoRepository extends JpaRepository<Empleado, Long> {
}
