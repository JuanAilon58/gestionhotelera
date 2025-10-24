package com.umg.gestionhotelera.dto;

import lombok.Data;

@Data
public class EmpleadoDTO {
    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private String telefono;
    private Long puestoId;
    private String puestoNombre;
}
