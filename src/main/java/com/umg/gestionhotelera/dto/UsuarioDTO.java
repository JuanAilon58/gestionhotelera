package com.umg.gestionhotelera.dto;

import lombok.Data;

import java.util.Set;

@Data
public class UsuarioDTO {
    private Long id;
    private String username;
    private Set<String> roles; // Changed from String to Set<String>
    private Long empleadoId;
    private String empleadoNombre;
}