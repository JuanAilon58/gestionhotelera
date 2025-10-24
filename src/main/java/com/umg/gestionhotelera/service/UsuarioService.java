package com.umg.gestionhotelera.service;

import com.umg.gestionhotelera.dto.UsuarioDTO;
import com.umg.gestionhotelera.entity.Empleado;
import com.umg.gestionhotelera.entity.Usuario;
import com.umg.gestionhotelera.repository.EmpleadoRepository;
import com.umg.gestionhotelera.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder; // Import PasswordEncoder
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Autowire PasswordEncoder

    public List<UsuarioDTO> findAll() {
        return usuarioRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public UsuarioDTO findById(Long id) {
        return usuarioRepository.findById(id).map(this::toDTO).orElse(null);
    }

    public UsuarioDTO save(UsuarioDTO usuarioDTO) {
        Usuario usuario = toEntity(usuarioDTO);
        // Hash password before saving
        if (usuario.getPassword() != null && !usuario.getPassword().isEmpty()) {
            usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        }
        return toDTO(usuarioRepository.save(usuario));
    }

    public void deleteById(Long id) {
        usuarioRepository.deleteById(id);
    }

    private UsuarioDTO toDTO(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setUsername(usuario.getUsername());
        dto.setRoles(usuario.getRoles());
        if (usuario.getEmpleado() != null) {
            dto.setEmpleadoId(usuario.getEmpleado().getId());
            dto.setEmpleadoNombre(usuario.getEmpleado().getNombre() + " " + usuario.getEmpleado().getApellido());
        }
        return dto;
    }

    private Usuario toEntity(UsuarioDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setId(dto.getId());
        usuario.setUsername(dto.getUsername());
        usuario.setRoles(dto.getRoles());
        // Note: Password should be handled separately and securely
        // For new user creation or password change, the password will be set in the DTO and then encoded in save method
        return usuario;
    }
}
