package com.sentinelcore.infrastructure_monitoring.controller;

import com.sentinelcore.infrastructure_monitoring.domain.User;
import com.sentinelcore.infrastructure_monitoring.repository.UserRepository;
import com.sentinelcore.infrastructure_monitoring.security.JwtService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body("Username already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("VIEWER");
        }

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(
                Map.of(
                        "message", "User registered successfully",
                        "username", savedUser.getUsername()
                )
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> request) {

        String username = request.get("username");
        String password = request.get("password");

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        username,
                        password
                )
        );

        User user = userRepository
                .findByUsername(username)
                .orElseThrow();

        String token = jwtService.generateToken(
                user.getUsername(),
                user.getRole()
        );

        return ResponseEntity.ok(
                Map.of(
                        "message", "Login successful",
                        "token", token,
                        "username", user.getUsername(),
                        "role", user.getRole()
                )
        );
    }
}