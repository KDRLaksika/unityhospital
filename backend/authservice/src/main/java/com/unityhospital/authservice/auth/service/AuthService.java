package com.unityhospital.authservice.auth.service;

import com.unityhospital.authservice.auth.dto.*;
import com.unityhospital.authservice.auth.entity.*;
import com.unityhospital.authservice.auth.repository.IAppUserRepository;
import com.unityhospital.authservice.auth.repository.IPasswordResetTokenRepository;
import com.unityhospital.authservice.auth.security.JwtUtil;
import com.unityhospital.authservice.common.exception.BadRequestException;
import com.unityhospital.authservice.common.exception.NotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService implements IAuthService {

    private final IAppUserRepository userRepo;
    private final IPasswordResetTokenRepository tokenRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(IAppUserRepository userRepo,
            IPasswordResetTokenRepository tokenRepo,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.tokenRepo = tokenRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    @Override
    public AuthResponseDto register(RegisterRequestDto dto) {
        if (userRepo.existsByUsernameIgnoreCase(dto.username)) {
            throw new BadRequestException("Username already exists.");
        }

        var user = new AppUser();
        user.setUsername(dto.username.toLowerCase().trim());
        user.setEmail(dto.email.toLowerCase().trim());
        user.setPasswordHash(passwordEncoder.encode(dto.password));
        user.setRole(dto.role != null ? dto.role : Role.UNKNOWN);
        user.setActive(true);

        var saved = userRepo.save(user);

        var res = new AuthResponseDto();
        res.userId = saved.getId();
        res.email = saved.getEmail();
        res.role = saved.getRole();
        res.accessToken = jwtUtil.generateToken(saved);
        return res;
    }

    @Transactional(readOnly = true)
    @Override
    public AuthResponseDto login(LoginRequestDto dto) {
        var user = userRepo.findByUsernameIgnoreCase(dto.username)
                .orElseThrow(() -> new BadRequestException("Invalid credentials."));

        if (!user.isActive())
            throw new BadRequestException("User is inactive.");

        boolean ok = passwordEncoder.matches(dto.password, user.getPasswordHash());
        if (!ok)
            throw new BadRequestException("Invalid credentials.");

        var res = new AuthResponseDto();
        res.userId = user.getId();
        res.email = user.getEmail();
        res.role = user.getRole();
        res.accessToken = jwtUtil.generateToken(user);
        return res;
    }

    @Transactional(readOnly = true)
    @Override
    public MeResponseDto me(String userId) {
        var id = UUID.fromString(userId);
        var user = userRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found: " + userId));

        var res = new MeResponseDto();
        res.userId = user.getId();
        res.email = user.getEmail();
        res.role = user.getRole();
        return res;
    }

    @Transactional
    @Override
    public String forgotPassword(ForgotPasswordRequestDto dto) {
        var user = userRepo.findByEmailIgnoreCase(dto.email)
                .orElseThrow(() -> new NotFoundException("User not found for email: " + dto.email));

        // generate reset token (return it for testing; later email it)
        String token = UUID.randomUUID().toString().replace("-", "");

        var prt = new PasswordResetToken();
        prt.setUser(user);
        prt.setToken(token);
        prt.setExpiresAt(LocalDateTime.now().plusMinutes(15));
        prt.setUsed(false);

        tokenRepo.save(prt);

        return token; // For now return token in API response
    }

    @Transactional
    @Override
    public void resetPassword(ResetPasswordRequestDto dto) {
        var prt = tokenRepo.findByToken(dto.token)
                .orElseThrow(() -> new BadRequestException("Invalid reset token."));

        if (prt.isUsed())
            throw new BadRequestException("Reset token already used.");
        if (prt.getExpiresAt().isBefore(LocalDateTime.now()))
            throw new BadRequestException("Reset token expired.");

        var user = prt.getUser();
        user.setPasswordHash(passwordEncoder.encode(dto.newPassword));
        userRepo.save(user);

        prt.setUsed(true);
        tokenRepo.save(prt);
    }
}
