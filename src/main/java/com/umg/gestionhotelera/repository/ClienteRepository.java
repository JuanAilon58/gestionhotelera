package com.umg.gestionhotelera.repository;

import com.umg.gestionhotelera.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
}
