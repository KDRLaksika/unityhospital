package com.unityhospital.authservice.auth.service;

import com.unityhospital.authservice.auth.dto.*;

public interface IAuthService {
    AuthResponseDto register(RegisterRequestDto dto);
    AuthResponseDto login(LoginRequestDto dto);

    MeResponseDto me(String userId);

    String forgotPassword(ForgotPasswordRequestDto dto);
    void resetPassword(ResetPasswordRequestDto dto);
}
