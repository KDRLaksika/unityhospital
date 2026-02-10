package com.unityhospital.appointmentservice.common.dto;

public class ApiResponse<T> {
    public boolean success;
    public String message;
    public T data;

    public static <T> ApiResponse<T> ok(T data) {
        var r = new ApiResponse<T>();
        r.success = true;
        r.message = "OK";
        r.data = data;
        return r;
    }

    public static <T> ApiResponse<T> fail(String message) {
        var r = new ApiResponse<T>();
        r.success = false;
        r.message = message;
        r.data = null;
        return r;
    }
}
