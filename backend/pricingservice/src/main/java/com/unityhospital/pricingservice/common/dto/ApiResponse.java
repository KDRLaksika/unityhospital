package com.unityhospital.pricingservice.common.dto;

public class ApiResponse<T> {
    public boolean success;
    public String message;
    public T data;

    public static <T> ApiResponse<T> ok(T data) {
        ApiResponse<T> r = new ApiResponse<>();
        r.success = true;
        r.message = "OK";
        r.data = data;
        return r;
    }

    public static <T> ApiResponse<T> fail(String message) {
        ApiResponse<T> r = new ApiResponse<>();
        r.success = false;
        r.message = message;
        r.data = null;
        return r;
    }
}

