package com.camerarentals.controller;

import com.camerarentals.dto.request.LoginRequest;
import com.camerarentals.dto.request.RegisterRequest;
import com.camerarentals.dto.response.ApiResponse;
import com.camerarentals.dto.response.AuthResponse;
import com.camerarentals.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse authResponse = authService.login(loginRequest);
        return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", authResponse));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        AuthResponse authResponse = authService.register(registerRequest);
        return ResponseEntity.ok(new ApiResponse<>(true, "User registered successfully", authResponse));
    }
}