package com.edward.cook_craft.mapper;

import com.edward.cook_craft.dto.request.CategoryRequest;
import com.edward.cook_craft.dto.response.CategoryResponse;
import com.edward.cook_craft.model.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public CategoryResponse toResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .createdAt(category.getCreatedAt())
                .modifiedAt(category.getModifiedAt())
                .createdBy(category.getCreatedBy())
                .modifiedBy(category.getModifiedBy())
                .status(category.getStatus())
                .version(category.getVersion())
                .build();
    }

    public Category of(CategoryRequest categoryRequest) {
        return Category.builder()
                .id(categoryRequest.getId())
                .name(categoryRequest.getName())
                .description(categoryRequest.getDescription())
                .build();
    }
}
