package com.unityhospital.appointmentservice.common.exception;

public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) { super(message); }
}
