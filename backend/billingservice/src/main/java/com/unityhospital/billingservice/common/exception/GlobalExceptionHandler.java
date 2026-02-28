package com.unityhospital.billingservice.common.exception;

import com.unityhospital.billingservice.common.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(NotFoundException.class)
    public ApiResponse<Object> handleNotFound(NotFoundException ex) {
        return ApiResponse.fail(ex.getMessage());
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(Exception.class)
    public ApiResponse<Object> handleOther(Exception ex) {
        return ApiResponse.fail("Server error: " + ex.getMessage());
    }
}