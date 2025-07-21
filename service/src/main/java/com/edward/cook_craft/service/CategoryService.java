package com.edward.cook_craft.service;

import com.edward.cook_craft.dto.request.CategoryRequest;
import com.edward.cook_craft.dto.response.CategoryResponse;
import com.edward.cook_craft.dto.response.PagedResponse;
import com.edward.cook_craft.mapper.PageMapper;
import com.edward.cook_craft.model.Category;
import com.edward.cook_craft.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository repository;
    private final PageMapper pageMapper;

    public List<CategoryResponse> getAll() {
        return repository.findAll().stream()
                .map(Category::toResponse).toList();
    }

    public PagedResponse<CategoryResponse> filter(CategoryRequest request, Pageable pageable) {
        Long id = (request.getId() != null) ? request.getId() : null;
        String name = (request.getName() != null) ? request.getName().toLowerCase() : null;
        String description = (request.getDescription() != null) ? request.getDescription().toLowerCase() : null;

        Page<Category> data = repository.filter(id, name, description, pageable);
        return pageMapper.map(data, Category::toResponse);
    }

    public CategoryResponse create(CategoryRequest request) {
        return Category.toResponse(repository.save(Category.of(request)));
    }
}
