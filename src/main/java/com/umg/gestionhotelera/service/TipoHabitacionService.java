package com.umg.gestionhotelera.service;

import com.umg.gestionhotelera.dto.TipoHabitacionDTO;
import com.umg.gestionhotelera.entity.TipoHabitacion;
import com.umg.gestionhotelera.repository.TipoHabitacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TipoHabitacionService {

    @Autowired
    private TipoHabitacionRepository tipoHabitacionRepository;

    public List<TipoHabitacionDTO> findAll() {
        return tipoHabitacionRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public TipoHabitacionDTO findById(Long id) {
        return tipoHabitacionRepository.findById(id).map(this::toDTO).orElse(null);
    }

    public TipoHabitacionDTO save(TipoHabitacionDTO tipoHabitacionDTO) {
        TipoHabitacion tipoHabitacion = toEntity(tipoHabitacionDTO);
        return toDTO(tipoHabitacionRepository.save(tipoHabitacion));
    }

    public void deleteById(Long id) {
        tipoHabitacionRepository.deleteById(id);
    }

    private TipoHabitacionDTO toDTO(TipoHabitacion tipoHabitacion) {
        TipoHabitacionDTO dto = new TipoHabitacionDTO();
        dto.setId(tipoHabitacion.getId());
        dto.setNombre(tipoHabitacion.getNombre());
        dto.setDescripcion(tipoHabitacion.getDescripcion());
        dto.setCapacidad(tipoHabitacion.getCapacidad());
        dto.setPrecio(tipoHabitacion.getPrecio());
        return dto;
    }

    private TipoHabitacion toEntity(TipoHabitacionDTO dto) {
        TipoHabitacion tipoHabitacion = new TipoHabitacion();
        tipoHabitacion.setId(dto.getId());
        tipoHabitacion.setNombre(dto.getNombre());
        tipoHabitacion.setDescripcion(dto.getDescripcion());
        tipoHabitacion.setCapacidad(dto.getCapacidad());
        tipoHabitacion.setPrecio(dto.getPrecio());
        return tipoHabitacion;
    }
}
