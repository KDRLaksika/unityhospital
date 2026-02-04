package com.unityhospital.authservice.auth.dto;

import jakarta.validation.constraints.*;

public class LoginRequestDto {
    @Email @NotBlank
    public String email;

    @NotBlank
    public String password;
}
