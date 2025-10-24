package com.umg.gestionhotelera.service;

import com.umg.gestionhotelera.dto.PuestoDTO;
import com.umg.gestionhotelera.entity.Puesto;
import com.umg.gestionhotelera.repository.PuestoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PuestoService {

    @Autowired
    private PuestoRepository puestoRepository;

    public List<PuestoDTO> findAll() {
        return puestoRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public PuestoDTO findById(Long id) {
        return puestoRepository.findById(id).map(this::toDTO).orElse(null);
    }

    public PuestoDTO save(PuestoDTO puestoDTO) {
        Puesto puesto = toEntity(puestoDTO);
        return toDTO(puestoRepository.save(puesto));
    }

    public void deleteById(Long id) {
        puestoRepository.deleteById(id);
    }

    private PuestoDTO toDTO(Puesto puesto) {
        PuestoDTO dto = new PuestoDTO();
        dto.setId(puesto.getId());
        dto.setNombre(puesto.getNombre());
        dto.setDescripcion(puesto.getDescripcion());
        return dto;
    }

    private Puesto toEntity(PuestoDTO dto) {
        Puesto puesto = new Puesto();
        puesto.setId(dto.getId());
        puesto.setNombre(dto.getNombre());
        puesto.setDescripcion(dto.getDescripcion());
        return puesto;
    }
}
