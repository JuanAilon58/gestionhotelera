package com.umg.gestionhotelera.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "habitaciones")
@Getter
@Setter
public class Habitacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String numero;
    private String estado; // (disponible, ocupada, limpieza, mantenimiento)

    @ManyToOne
    @JoinColumn(name = "tipo_habitacion_id")
    private TipoHabitacion tipoHabitacion;
}
