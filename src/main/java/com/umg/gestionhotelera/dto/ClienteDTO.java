package com.umg.gestionhotelera.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ClienteDTO {
    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private String telefono;
    private String direccion;
    private String nit;
    private LocalDate fechaNacimiento;
}
