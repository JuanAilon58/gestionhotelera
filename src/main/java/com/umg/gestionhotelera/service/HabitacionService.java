package com.umg.gestionhotelera.service;

import com.umg.gestionhotelera.dto.HabitacionDTO;
import com.umg.gestionhotelera.entity.Habitacion;
import com.umg.gestionhotelera.entity.TipoHabitacion;
import com.umg.gestionhotelera.repository.HabitacionRepository;
import com.umg.gestionhotelera.repository.TipoHabitacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HabitacionService {

    @Autowired
    private HabitacionRepository habitacionRepository;

    @Autowired
    private TipoHabitacionRepository tipoHabitacionRepository;

    public List<HabitacionDTO> findAll() {
        return habitacionRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public HabitacionDTO findById(Long id) {
        return habitacionRepository.findById(id).map(this::toDTO).orElse(null);
    }

    public HabitacionDTO save(HabitacionDTO habitacionDTO) {
        Habitacion habitacion = toEntity(habitacionDTO);
        return toDTO(habitacionRepository.save(habitacion));
    }

    public void deleteById(Long id) {
        habitacionRepository.deleteById(id);
    }

    private HabitacionDTO toDTO(Habitacion habitacion) {
        HabitacionDTO dto = new HabitacionDTO();
        dto.setId(habitacion.getId());
        dto.setNumero(habitacion.getNumero());
        dto.setEstado(habitacion.getEstado());
        if (habitacion.getTipoHabitacion() != null) {
            dto.setTipoHabitacionId(habitacion.getTipoHabitacion().getId());
            dto.setTipoHabitacionNombre(habitacion.getTipoHabitacion().getNombre());
        }
        return dto;
    }

    private Habitacion toEntity(HabitacionDTO dto) {
        Habitacion habitacion = new Habitacion();
        habitacion.setId(dto.getId());
        habitacion.setNumero(dto.getNumero());
        habitacion.setEstado(dto.getEstado());
        if (dto.getTipoHabitacionId() != null) {
            TipoHabitacion tipoHabitacion = tipoHabitacionRepository.findById(dto.getTipoHabitacionId()).orElse(null);
            habitacion.setTipoHabitacion(tipoHabitacion);
        }
        return habitacion;
    }
}
