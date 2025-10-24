package com.umg.gestionhotelera.controller;

import com.umg.gestionhotelera.dto.HabitacionDTO;
import com.umg.gestionhotelera.service.HabitacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/habitaciones")
public class HabitacionController {

    @Autowired
    private HabitacionService habitacionService;

    @GetMapping
    public List<HabitacionDTO> getAll() {
        return habitacionService.findAll();
    }

    @GetMapping("/{id}")
    public HabitacionDTO getById(@PathVariable Long id) {
        return habitacionService.findById(id);
    }

    @PostMapping
    public HabitacionDTO create(@RequestBody HabitacionDTO habitacionDTO) {
        return habitacionService.save(habitacionDTO);
    }

    @PutMapping("/{id}")
    public HabitacionDTO update(@PathVariable Long id, @RequestBody HabitacionDTO habitacionDTO) {
        habitacionDTO.setId(id);
        return habitacionService.save(habitacionDTO);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        habitacionService.deleteById(id);
    }
}
