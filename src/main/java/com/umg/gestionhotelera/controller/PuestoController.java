package com.umg.gestionhotelera.controller;

import com.umg.gestionhotelera.dto.PuestoDTO;
import com.umg.gestionhotelera.service.PuestoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/puestos")
public class PuestoController {

    @Autowired
    private PuestoService puestoService;

    @GetMapping
    public List<PuestoDTO> getAll() {
        return puestoService.findAll();
    }

    @GetMapping("/{id}")
    public PuestoDTO getById(@PathVariable Long id) {
        return puestoService.findById(id);
    }

    @PostMapping
    public PuestoDTO create(@RequestBody PuestoDTO puestoDTO) {
        return puestoService.save(puestoDTO);
    }

    @PutMapping("/{id}")
    public PuestoDTO update(@PathVariable Long id, @RequestBody PuestoDTO puestoDTO) {
        puestoDTO.setId(id);
        return puestoService.save(puestoDTO);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        puestoService.deleteById(id);
    }
}
