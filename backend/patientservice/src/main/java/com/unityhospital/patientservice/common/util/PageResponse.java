package com.unityhospital.patientservice.common.util;

import org.springframework.data.domain.Page;
import java.util.List;

public class PageResponse<T> {
    public List<T> items;
    public int page;
    public int size;
    public long totalElements;
    public int totalPages;

    public static <T, E> PageResponse<T> from(Page<E> page, List<T> items) {
        var r = new PageResponse<T>();
        r.items = items;
        r.page = page.getNumber();
        r.size = page.getSize();
        r.totalElements = page.getTotalElements();
        r.totalPages = page.getTotalPages();
        return r;
    }
}
