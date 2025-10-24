package com.umg.gestionhotelera.dto;

import lombok.Data;
import java.util.List;

@Data
public class FolioDTO {
    private Long id;
    private Long estanciaId;
    private List<CargoDTO> cargos;
    private double total;
    private boolean pagado;
}
