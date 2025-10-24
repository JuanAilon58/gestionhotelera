package com.umg.gestionhotelera.controller;

import com.umg.gestionhotelera.dto.ReservacionDTO;
import com.umg.gestionhotelera.service.ReservacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservaciones")
public class ReservacionController {

    @Autowired
    private ReservacionService reservacionService;

    @GetMapping
    public List<ReservacionDTO> getAll() {
        return reservacionService.findAll();
    }

    @GetMapping("/{id}")
    public ReservacionDTO getById(@PathVariable Long id) {
        return reservacionService.findById(id);
    }

    @PostMapping
    public ReservacionDTO create(@RequestBody ReservacionDTO reservacionDTO) {
        return reservacionService.save(reservacionDTO);
    }

    @PutMapping("/{id}")
    public ReservacionDTO update(@PathVariable Long id, @RequestBody ReservacionDTO reservacionDTO) {
        reservacionDTO.setId(id);
        return reservacionService.save(reservacionDTO);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        reservacionService.deleteById(id);
    }
}
