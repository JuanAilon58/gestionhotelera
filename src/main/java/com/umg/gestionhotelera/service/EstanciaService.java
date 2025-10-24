package com.umg.gestionhotelera.service;

import com.umg.gestionhotelera.dto.EstanciaDTO;
import com.umg.gestionhotelera.entity.Cliente;
import com.umg.gestionhotelera.entity.Estancia;
import com.umg.gestionhotelera.entity.Habitacion;
import com.umg.gestionhotelera.entity.Reservacion;
import com.umg.gestionhotelera.repository.ClienteRepository;
import com.umg.gestionhotelera.repository.EstanciaRepository;
import com.umg.gestionhotelera.repository.HabitacionRepository;
import com.umg.gestionhotelera.repository.ReservacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EstanciaService {

    @Autowired
    private EstanciaRepository estanciaRepository;

    @Autowired
    private ReservacionRepository reservacionRepository;

    @Autowired
    private HabitacionRepository habitacionRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    public List<EstanciaDTO> findAll() {
        return estanciaRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public EstanciaDTO findById(Long id) {
        return estanciaRepository.findById(id).map(this::toDTO).orElse(null);
    }

    public EstanciaDTO save(EstanciaDTO estanciaDTO) {
        Estancia estancia = toEntity(estanciaDTO);
        return toDTO(estanciaRepository.save(estancia));
    }

    public void deleteById(Long id) {
        estanciaRepository.deleteById(id);
    }

    private EstanciaDTO toDTO(Estancia estancia) {
        EstanciaDTO dto = new EstanciaDTO();
        dto.setId(estancia.getId());
        dto.setFechaCheckIn(estancia.getFechaCheckIn());
        dto.setFechaCheckOut(estancia.getFechaCheckOut());
        dto.setEstado(estancia.getEstado());
        if (estancia.getReservacion() != null) {
            dto.setReservacionId(estancia.getReservacion().getId());
        }
        if (estancia.getHabitacion() != null) {
            dto.setHabitacionId(estancia.getHabitacion().getId());
            dto.setHabitacionNumero(estancia.getHabitacion().getNumero());
        }
        if (estancia.getCliente() != null) {
            dto.setClienteId(estancia.getCliente().getId());
            dto.setClienteNombre(estancia.getCliente().getNombre() + " " + estancia.getCliente().getApellido());
        }
        return dto;
    }

    private Estancia toEntity(EstanciaDTO dto) {
        Estancia estancia = new Estancia();
        estancia.setId(dto.getId());
        estancia.setFechaCheckIn(dto.getFechaCheckIn());
        estancia.setFechaCheckOut(dto.getFechaCheckOut());
        estancia.setEstado(dto.getEstado());
        if (dto.getReservacionId() != null) {
            Reservacion reservacion = reservacionRepository.findById(dto.getReservacionId()).orElse(null);
            estancia.setReservacion(reservacion);
        }
        if (dto.getHabitacionId() != null) {
            Habitacion habitacion = habitacionRepository.findById(dto.getHabitacionId()).orElse(null);
            estancia.setHabitacion(habitacion);
        }
        if (dto.getClienteId() != null) {
            Cliente cliente = clienteRepository.findById(dto.getClienteId()).orElse(null);
            estancia.setCliente(cliente);
        }
        return estancia;
    }
}
