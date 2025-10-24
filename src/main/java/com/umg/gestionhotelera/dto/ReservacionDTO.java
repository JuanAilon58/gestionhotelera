package com.umg.gestionhotelera.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ReservacionDTO {
    private Long id;
    private Long clienteId;
    private String clienteNombre;
    private Long habitacionId;
    private String habitacionNumero;
    private LocalDate fechaLlegada;
    private LocalDate fechaSalida;
    private String estado;
}
