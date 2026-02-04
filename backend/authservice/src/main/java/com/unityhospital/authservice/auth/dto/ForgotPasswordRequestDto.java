package com.unityhospital.authservice.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class ForgotPasswordRequestDto {
    @Email @NotBlank
    public String email;
}
