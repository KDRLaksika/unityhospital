package com.unityhospital.hospitalservice.common.util;

import java.util.List;

public class PageResponse<T> {
    public List<T> items;
    public int page;
    public int size;
    public long totalItems;
    public int totalPages;

    public static <T> PageResponse<T> of(List<T> items, int page, int size, long totalItems, int totalPages) {
        var r = new PageResponse<T>();
        r.items = items;
        r.page = page;
        r.size = size;
        r.totalItems = totalItems;
        r.totalPages = totalPages;
        return r;
    }
}
