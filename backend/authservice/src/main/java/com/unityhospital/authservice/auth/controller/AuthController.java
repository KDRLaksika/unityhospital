package com.unityhospital.authservice.auth.controller;

import com.unityhospital.authservice.auth.dto.*;
import com.unityhospital.authservice.auth.service.IAuthService;
import com.unityhospital.authservice.common.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final IAuthService service;

    public AuthController(IAuthService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public ApiResponse<AuthResponseDto> register(@Valid @RequestBody RegisterRequestDto dto) {
        return ApiResponse.ok(service.register(dto));
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponseDto> login(@Valid @RequestBody LoginRequestDto dto) {
        return ApiResponse.ok(service.login(dto));
    }

    @GetMapping("/me")
    public ApiResponse<MeResponseDto> me(Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ApiResponse.ok(service.me(userId));
    }

    @PostMapping("/forgot-password")
    public ApiResponse<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequestDto dto) {
        return ApiResponse.ok(service.forgotPassword(dto));
    }

    @PostMapping("/reset-password")
    public ApiResponse<Object> resetPassword(@Valid @RequestBody ResetPasswordRequestDto dto) {
        service.resetPassword(dto);
        return ApiResponse.ok(null);
    }

    @GetMapping("/users")
    public ApiResponse<List<UserListItemDto>> listUsers() {
        return ApiResponse.ok(service.listUsers());
    }
}
