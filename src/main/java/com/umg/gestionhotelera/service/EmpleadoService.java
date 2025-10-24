package com.umg.gestionhotelera.service;

import com.umg.gestionhotelera.dto.EmpleadoDTO;
import com.umg.gestionhotelera.entity.Empleado;
import com.umg.gestionhotelera.entity.Puesto;
import com.umg.gestionhotelera.repository.EmpleadoRepository;
import com.umg.gestionhotelera.repository.PuestoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmpleadoService {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private PuestoRepository puestoRepository;

    public List<EmpleadoDTO> findAll() {
        return empleadoRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public EmpleadoDTO findById(Long id) {
        return empleadoRepository.findById(id).map(this::toDTO).orElse(null);
    }

    public EmpleadoDTO save(EmpleadoDTO empleadoDTO) {
        Empleado empleado = toEntity(empleadoDTO);
        return toDTO(empleadoRepository.save(empleado));
    }

    public void deleteById(Long id) {
        empleadoRepository.deleteById(id);
    }

    private EmpleadoDTO toDTO(Empleado empleado) {
        EmpleadoDTO dto = new EmpleadoDTO();
        dto.setId(empleado.getId());
        dto.setNombre(empleado.getNombre());
        dto.setApellido(empleado.getApellido());
        dto.setEmail(empleado.getEmail());
        dto.setTelefono(empleado.getTelefono());
        if (empleado.getPuesto() != null) {
            dto.setPuestoId(empleado.getPuesto().getId());
            dto.setPuestoNombre(empleado.getPuesto().getNombre());
        }
        return dto;
    }

    private Empleado toEntity(EmpleadoDTO dto) {
        Empleado empleado = new Empleado();
        empleado.setId(dto.getId());
        empleado.setNombre(dto.getNombre());
        empleado.setApellido(dto.getApellido());
        empleado.setEmail(dto.getEmail());
        empleado.setTelefono(dto.getTelefono());
        if (dto.getPuestoId() != null) {
            Puesto puesto = puestoRepository.findById(dto.getPuestoId()).orElse(null);
            empleado.setPuesto(puesto);
        }
        return empleado;
    }
}
