package com.umg.gestionhotelera.repository;

import com.umg.gestionhotelera.entity.Folio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FolioRepository extends JpaRepository<Folio, Long> {
    Folio findByEstanciaId(Long estanciaId);
}
