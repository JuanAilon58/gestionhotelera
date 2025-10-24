package com.umg.gestionhotelera.service;

import com.umg.gestionhotelera.dto.ClienteDTO;
import com.umg.gestionhotelera.entity.Cliente;
import com.umg.gestionhotelera.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    public List<ClienteDTO> findAll() {
        return clienteRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ClienteDTO findById(Long id) {
        return clienteRepository.findById(id).map(this::toDTO).orElse(null);
    }

    public ClienteDTO save(ClienteDTO clienteDTO) {
        Cliente cliente = toEntity(clienteDTO);
        return toDTO(clienteRepository.save(cliente));
    }

    public void deleteById(Long id) {
        clienteRepository.deleteById(id);
    }

    private ClienteDTO toDTO(Cliente cliente) {
        ClienteDTO dto = new ClienteDTO();
        dto.setId(cliente.getId());
        dto.setNombre(cliente.getNombre());
        dto.setApellido(cliente.getApellido());
        dto.setEmail(cliente.getEmail());
        dto.setTelefono(cliente.getTelefono());
        dto.setDireccion(cliente.getDireccion());
        dto.setNit(cliente.getNit());
        dto.setFechaNacimiento(cliente.getFechaNacimiento());
        return dto;
    }

    private Cliente toEntity(ClienteDTO dto) {
        Cliente cliente = new Cliente();
        cliente.setId(dto.getId());
        cliente.setNombre(dto.getNombre());
        cliente.setApellido(dto.getApellido());
        cliente.setEmail(dto.getEmail());
        cliente.setTelefono(dto.getTelefono());
        cliente.setDireccion(dto.getDireccion());
        cliente.setNit(dto.getNit());
        cliente.setFechaNacimiento(dto.getFechaNacimiento());
        return cliente;
    }
}
