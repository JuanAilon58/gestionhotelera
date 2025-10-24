package com.umg.gestionhotelera.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CargoDTO {
    private Long id;
    private Long folioId;
    private Long servicioId;
    private String servicioNombre;
    private int cantidad;
    private double subtotal;
    private LocalDateTime fecha;
}
