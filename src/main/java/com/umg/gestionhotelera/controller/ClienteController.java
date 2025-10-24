package com.umg.gestionhotelera.controller;

import com.umg.gestionhotelera.dto.ClienteDTO;
import com.umg.gestionhotelera.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @GetMapping
    public List<ClienteDTO> getAll() {
        return clienteService.findAll();
    }

    @GetMapping("/{id}")
    public ClienteDTO getById(@PathVariable Long id) {
        return clienteService.findById(id);
    }

    @PostMapping
    public ClienteDTO create(@RequestBody ClienteDTO clienteDTO) {
        return clienteService.save(clienteDTO);
    }

    @PutMapping("/{id}")
    public ClienteDTO update(@PathVariable Long id, @RequestBody ClienteDTO clienteDTO) {
        clienteDTO.setId(id);
        return clienteService.save(clienteDTO);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        clienteService.deleteById(id);
    }
}
