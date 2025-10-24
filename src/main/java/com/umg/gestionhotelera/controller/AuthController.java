package com.umg.gestionhotelera.controller;

import com.umg.gestionhotelera.dto.AuthRequest;
// Borramos la importación de AuthResponse
import com.umg.gestionhotelera.service.UserDetailsServiceImpl;
import com.umg.gestionhotelera.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Importaciones necesarias para Map y List
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthRequest authRequest) throws Exception {
        // La autenticación sigue igual
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
        );

        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getUsername());
        
        // Asumiendo que generateToken ahora solo necesita el username (o userDetails)
        final String jwt = jwtUtil.generateToken(userDetails); // O jwtUtil.generateToken(userDetails.getUsername(), ...roles...);
        

        // --- INICIO DE LA CORRECCIÓN ---

        // 1. Crear el objeto 'user' que espera el frontend
        List<String> roles = userDetails.getAuthorities().stream()
                                .map(grantedAuthority -> grantedAuthority.getAuthority())
                                .collect(Collectors.toList());

        Map<String, Object> userMap = new HashMap<>();
        userMap.put("username", userDetails.getUsername());
        userMap.put("roles", roles);
        // Puedes añadir más campos del 'user' aquí si los necesitas en el frontend
        // userMap.put("email", ...); 

        // 2. Crear la respuesta JSON final que coincide con React
        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt); // Clave "token"
        response.put("user", userMap);  // Clave "user" con el objeto dentro

        // 3. Devolver el Map. Spring Boot lo convertirá en JSON.
        return ResponseEntity.ok(response);

        // --- FIN DE LA CORRECCIÓN ---
    }
}