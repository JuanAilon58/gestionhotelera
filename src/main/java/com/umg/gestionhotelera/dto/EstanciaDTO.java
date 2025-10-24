package com.umg.gestionhotelera.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EstanciaDTO {
    private Long id;
    private Long reservacionId;
    private Long habitacionId;
    private String habitacionNumero;
    private Long clienteId;
    private String clienteNombre;
    private LocalDateTime fechaCheckIn;
    private LocalDateTime fechaCheckOut;
    private String estado;
}
