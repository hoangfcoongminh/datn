package com.edward.cook_craft.mapper;

import com.edward.cook_craft.dto.response.PagedResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Function;

@Component
public class PageMapper {

    public <T, R> PagedResponse<R> map(Page<T> page, Function<T, R> converter) {
        List<R> content = page.getContent().stream().map(converter).toList();

        Pageable pageable = page.getPageable();

        String sort = pageable.getSort().isSorted()
                ? pageable.getSort().toString()
                : "unsorted";

        return new PagedResponse<>(
                content,
                pageable.getPageNumber(),
                pageable.getPageSize(),
                page.getTotalElements(),
                sort
        );
    }

    public <T> PagedResponse<T> map(List<T> data, Pageable pageable, long totalElements) {
        String sort = pageable.getSort().isSorted()
                ? pageable.getSort().toString()
                : "unsorted";

        return new PagedResponse<>(
                data,
                pageable.getPageNumber(),
                pageable.getPageSize(),
                totalElements,
                sort
        );
    }

}
