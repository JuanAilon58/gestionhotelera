package com.umg.gestionhotelera.controller;

import com.umg.gestionhotelera.dto.EmpleadoDTO;
import com.umg.gestionhotelera.service.EmpleadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empleados")
public class EmpleadoController {

    @Autowired
    private EmpleadoService empleadoService;

    @GetMapping
    public List<EmpleadoDTO> getAll() {
        return empleadoService.findAll();
    }

    @GetMapping("/{id}")
    public EmpleadoDTO getById(@PathVariable Long id) {
        return empleadoService.findById(id);
    }

    @PostMapping
    public EmpleadoDTO create(@RequestBody EmpleadoDTO empleadoDTO) {
        return empleadoService.save(empleadoDTO);
    }

    @PutMapping("/{id}")
    public EmpleadoDTO update(@PathVariable Long id, @RequestBody EmpleadoDTO empleadoDTO) {
        empleadoDTO.setId(id);
        return empleadoService.save(empleadoDTO);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        empleadoService.deleteById(id);
    }
}
