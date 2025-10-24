package com.umg.gestionhotelera.dto;

import lombok.Data;

@Data
public class TipoHabitacionDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private int capacidad;
    private double precio;
}
