package com.umg.gestionhotelera.dto;

import lombok.Data;

@Data
public class HabitacionDTO {
    private Long id;
    private String numero;
    private String estado;
    private Long tipoHabitacionId;
    private String tipoHabitacionNombre;
}
