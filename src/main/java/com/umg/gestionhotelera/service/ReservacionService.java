package com.umg.gestionhotelera.service;

import com.umg.gestionhotelera.dto.ReservacionDTO;
import com.umg.gestionhotelera.entity.Cliente;
import com.umg.gestionhotelera.entity.Habitacion;
import com.umg.gestionhotelera.entity.Reservacion;
import com.umg.gestionhotelera.repository.ClienteRepository;
import com.umg.gestionhotelera.repository.HabitacionRepository;
import com.umg.gestionhotelera.repository.ReservacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservacionService {

    @Autowired
    private ReservacionRepository reservacionRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private HabitacionRepository habitacionRepository;

    public List<ReservacionDTO> findAll() {
        return reservacionRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ReservacionDTO findById(Long id) {
        return reservacionRepository.findById(id).map(this::toDTO).orElse(null);
    }

    public ReservacionDTO save(ReservacionDTO reservacionDTO) {
        Reservacion reservacion = toEntity(reservacionDTO);
        return toDTO(reservacionRepository.save(reservacion));
    }

    public void deleteById(Long id) {
        reservacionRepository.deleteById(id);
    }

    private ReservacionDTO toDTO(Reservacion reservacion) {
        ReservacionDTO dto = new ReservacionDTO();
        dto.setId(reservacion.getId());
        dto.setFechaLlegada(reservacion.getFechaLlegada());
        dto.setFechaSalida(reservacion.getFechaSalida());
        dto.setEstado(reservacion.getEstado());
        if (reservacion.getCliente() != null) {
            dto.setClienteId(reservacion.getCliente().getId());
            dto.setClienteNombre(reservacion.getCliente().getNombre() + " " + reservacion.getCliente().getApellido());
        }
        if (reservacion.getHabitacion() != null) {
            dto.setHabitacionId(reservacion.getHabitacion().getId());
            dto.setHabitacionNumero(reservacion.getHabitacion().getNumero());
        }
        return dto;
    }

    private Reservacion toEntity(ReservacionDTO dto) {
        Reservacion reservacion = new Reservacion();
        reservacion.setId(dto.getId());
        reservacion.setFechaLlegada(dto.getFechaLlegada());
        reservacion.setFechaSalida(dto.getFechaSalida());
        reservacion.setEstado(dto.getEstado());
        if (dto.getClienteId() != null) {
            Cliente cliente = clienteRepository.findById(dto.getClienteId()).orElse(null);
            reservacion.setCliente(cliente);
        }
        if (dto.getHabitacionId() != null) {
            Habitacion habitacion = habitacionRepository.findById(dto.getHabitacionId()).orElse(null);
            reservacion.setHabitacion(habitacion);
        }
        return reservacion;
    }
}
