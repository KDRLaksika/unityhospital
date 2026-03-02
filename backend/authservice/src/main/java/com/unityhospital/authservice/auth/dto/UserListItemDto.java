package com.unityhospital.authservice.auth.dto;

import com.unityhospital.authservice.auth.entity.Role;
import java.util.UUID;

public class UserListItemDto {
    public UUID userId;
    public String username;
    public String email;
    public Role role;
    public boolean isActive;
}
