package com.unityhospital.billingservice.common.util;

import java.util.List;

public class PageResponse<T> {
    public List<T> items;
    public int page;
    public int size;
    public long totalElements;
    public int totalPages;

    public static <T> PageResponse<T> of(List<T> items, int page, int size, long totalElements, int totalPages) {
        PageResponse<T> r = new PageResponse<>();
        r.items = items;
        r.page = page;
        r.size = size;
        r.totalElements = totalElements;
        r.totalPages = totalPages;
        return r;
    }
}