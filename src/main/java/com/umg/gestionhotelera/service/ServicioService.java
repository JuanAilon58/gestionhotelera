package com.umg.gestionhotelera.service;

import com.umg.gestionhotelera.dto.ServicioDTO;
import com.umg.gestionhotelera.entity.Servicio;
import com.umg.gestionhotelera.repository.ServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServicioService {

    @Autowired
    private ServicioRepository servicioRepository;

    public List<ServicioDTO> findAll() {
        return servicioRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ServicioDTO findById(Long id) {
        return servicioRepository.findById(id).map(this::toDTO).orElse(null);
    }

    public ServicioDTO save(ServicioDTO servicioDTO) {
        Servicio servicio = toEntity(servicioDTO);
        return toDTO(servicioRepository.save(servicio));
    }

    public void deleteById(Long id) {
        servicioRepository.deleteById(id);
    }

    private ServicioDTO toDTO(Servicio servicio) {
        ServicioDTO dto = new ServicioDTO();
        dto.setId(servicio.getId());
        dto.setNombre(servicio.getNombre());
        dto.setDescripcion(servicio.getDescripcion());
        dto.setPrecio(servicio.getPrecio());
        return dto;
    }

    private Servicio toEntity(ServicioDTO dto) {
        Servicio servicio = new Servicio();
        servicio.setId(dto.getId());
        servicio.setNombre(dto.getNombre());
        servicio.setDescripcion(dto.getDescripcion());
        servicio.setPrecio(dto.getPrecio());
        return servicio;
    }
}
