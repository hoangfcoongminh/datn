package com.edward.cook_craft.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Valid
@JsonIgnoreProperties(ignoreUnknown = true)
public class CategoryRequest {

    private Long id;

    @NotBlank
    private String name;
    private String description;
    private Integer status;
    private String search;
}
