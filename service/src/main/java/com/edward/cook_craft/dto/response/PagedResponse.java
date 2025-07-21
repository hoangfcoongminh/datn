package com.edward.cook_craft.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PagedResponse<R> {

    private List<R> content;
    private int page;
    private int size;
    private long total;
    private String sort;
}
