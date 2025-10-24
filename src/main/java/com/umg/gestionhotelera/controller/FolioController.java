package com.umg.gestionhotelera.controller;

import com.umg.gestionhotelera.dto.CargoDTO;
import com.umg.gestionhotelera.dto.FolioDTO;
import com.umg.gestionhotelera.service.FolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/folios")
public class FolioController {

    @Autowired
    private FolioService folioService;

    @GetMapping
    public List<FolioDTO> getAll() {
        return folioService.findAll();
    }

    @GetMapping("/estancia/{estanciaId}")
    public FolioDTO getByEstanciaId(@PathVariable Long estanciaId) {
        return folioService.findByEstanciaId(estanciaId);
    }

    @PostMapping("/cargos")
    public CargoDTO addCargo(@RequestBody CargoDTO cargoDTO) {
        return folioService.addCargo(cargoDTO);
    }

    @DeleteMapping("/cargos/{cargoId}")
    public void deleteCargo(@PathVariable Long cargoId) {
        folioService.deleteCargo(cargoId);
    }
}
