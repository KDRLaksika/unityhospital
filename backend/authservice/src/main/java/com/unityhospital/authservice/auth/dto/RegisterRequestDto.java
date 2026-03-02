package com.unityhospital.authservice.auth.dto;

import com.unityhospital.authservice.auth.entity.Role;
import jakarta.validation.constraints.*;

public class RegisterRequestDto {
    @Email
    @NotBlank
    @Size(max = 150)
    public String email;

    @NotBlank
    @Size(min = 3, max = 100)
    public String username;

    @NotBlank
    @Size(min = 6, max = 100)
    public String password;

    public Role role; // optional; default STAFF if null
}
