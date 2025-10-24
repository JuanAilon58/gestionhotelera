package com.umg.gestionhotelera.repository;

import com.umg.gestionhotelera.entity.Reservacion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservacionRepository extends JpaRepository<Reservacion, Long> {
}
