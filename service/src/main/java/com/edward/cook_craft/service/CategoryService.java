package com.edward.cook_craft.service;

import com.edward.cook_craft.dto.request.CategoryRequest;
import com.edward.cook_craft.dto.response.CategoryResponse;
import com.edward.cook_craft.model.Category;
import com.edward.cook_craft.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository repository;

    public List<CategoryResponse> getAll() {
        return repository.findAll().stream()
                .map(Category::toDto).toList();
    }

    public CategoryResponse create(CategoryRequest request) {
        return Category.toDto(repository.save(Category.of(request)));
    }
}
