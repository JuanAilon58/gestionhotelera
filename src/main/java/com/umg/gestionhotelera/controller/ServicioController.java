package com.umg.gestionhotelera.controller;

import com.umg.gestionhotelera.dto.ServicioDTO;
import com.umg.gestionhotelera.service.ServicioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios")
public class ServicioController {

    @Autowired
    private ServicioService servicioService;

    @GetMapping
    public List<ServicioDTO> getAll() {
        return servicioService.findAll();
    }

    @GetMapping("/{id}")
    public ServicioDTO getById(@PathVariable Long id) {
        return servicioService.findById(id);
    }

    @PostMapping
    public ServicioDTO create(@RequestBody ServicioDTO servicioDTO) {
        return servicioService.save(servicioDTO);
    }

    @PutMapping("/{id}")
    public ServicioDTO update(@PathVariable Long id, @RequestBody ServicioDTO servicioDTO) {
        servicioDTO.setId(id);
        return servicioService.save(servicioDTO);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        servicioService.deleteById(id);
    }
}
