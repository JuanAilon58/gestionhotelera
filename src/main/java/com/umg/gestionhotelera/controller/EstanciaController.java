package com.umg.gestionhotelera.controller;

import com.umg.gestionhotelera.dto.EstanciaDTO;
import com.umg.gestionhotelera.service.EstanciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estancias")
public class EstanciaController {

    @Autowired
    private EstanciaService estanciaService;

    @GetMapping
    public List<EstanciaDTO> getAll() {
        return estanciaService.findAll();
    }

    @GetMapping("/{id}")
    public EstanciaDTO getById(@PathVariable Long id) {
        return estanciaService.findById(id);
    }

    @PostMapping
    public EstanciaDTO create(@RequestBody EstanciaDTO estanciaDTO) {
        return estanciaService.save(estanciaDTO);
    }

    @PutMapping("/{id}")
    public EstanciaDTO update(@PathVariable Long id, @RequestBody EstanciaDTO estanciaDTO) {
        estanciaDTO.setId(id);
        return estanciaService.save(estanciaDTO);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        estanciaService.deleteById(id);
    }
}
