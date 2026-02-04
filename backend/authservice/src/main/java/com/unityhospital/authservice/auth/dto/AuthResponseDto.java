package com.unityhospital.authservice.auth.dto;

import com.unityhospital.authservice.auth.entity.Role;

import java.util.UUID;

public class AuthResponseDto {
    public UUID userId;
    public String email;
    public Role role;
    public String accessToken;
}
