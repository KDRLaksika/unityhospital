package com.unityhospital.authservice.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ResetPasswordRequestDto {
    @NotBlank
    public String token;

    @NotBlank @Size(min = 6, max = 100)
    public String newPassword;
}
