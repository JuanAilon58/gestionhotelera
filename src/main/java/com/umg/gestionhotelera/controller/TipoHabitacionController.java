package com.umg.gestionhotelera.controller;

import com.umg.gestionhotelera.dto.TipoHabitacionDTO;
import com.umg.gestionhotelera.service.TipoHabitacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipos-habitacion")
public class TipoHabitacionController {

    @Autowired
    private TipoHabitacionService tipoHabitacionService;

    @GetMapping
    public List<TipoHabitacionDTO> getAll() {
        return tipoHabitacionService.findAll();
    }

    @GetMapping("/{id}")
    public TipoHabitacionDTO getById(@PathVariable Long id) {
        return tipoHabitacionService.findById(id);
    }

    @PostMapping
    public TipoHabitacionDTO create(@RequestBody TipoHabitacionDTO tipoHabitacionDTO) {
        return tipoHabitacionService.save(tipoHabitacionDTO);
    }

    @PutMapping("/{id}")
    public TipoHabitacionDTO update(@PathVariable Long id, @RequestBody TipoHabitacionDTO tipoHabitacionDTO) {
        tipoHabitacionDTO.setId(id);
        return tipoHabitacionService.save(tipoHabitacionDTO);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        tipoHabitacionService.deleteById(id);
    }
}
