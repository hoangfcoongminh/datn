package com.edward.cook_craft.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Valid
public class CategoryRequest {

    private Long id;

    @NotBlank
    private String name;
    private String description;
    private Integer status;
}
