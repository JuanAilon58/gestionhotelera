package com.umg.gestionhotelera.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "cargos")
@Getter
@Setter
public class Cargo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "folio_id")
    private Folio folio;

    @ManyToOne
    @JoinColumn(name = "servicio_id")
    private Servicio servicio;

    private int cantidad;
    private double subtotal;
    private LocalDateTime fecha;
}
