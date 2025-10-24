package com.umg.gestionhotelera.dto;

import lombok.Data;

@Data
public class ServicioDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private double precio;
}
