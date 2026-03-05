package com.unityhospital.authservice.auth.dto;

import jakarta.validation.constraints.*;

public class LoginRequestDto {
    @NotBlank
    public String username;

    @NotBlank
    public String password;
}
