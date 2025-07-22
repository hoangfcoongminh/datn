package com.edward.cook_craft.service;

import com.edward.cook_craft.dto.request.CategoryRequest;
import com.edward.cook_craft.dto.response.CategoryResponse;
import com.edward.cook_craft.dto.response.PagedResponse;
import com.edward.cook_craft.enums.EntityStatus;
import com.edward.cook_craft.exception.CustomException;
import com.edward.cook_craft.mapper.CategoryMapper;
import com.edward.cook_craft.mapper.PageMapper;
import com.edward.cook_craft.model.Category;
import com.edward.cook_craft.model.User;
import com.edward.cook_craft.repository.CategoryRepository;
import com.edward.cook_craft.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository repository;
    private final PageMapper pageMapper;
    private final CategoryMapper mapper;

    public List<CategoryResponse> getAll() {
        return repository.findAll().stream()
                .map(mapper::toResponse).toList();
    }

    public PagedResponse<CategoryResponse> filter(CategoryRequest request, Pageable pageable) {
        Long id = (request.getId() != null) ? request.getId() : null; // ??
        String name = (request.getName() != null) ? request.getName().toLowerCase() : null;
        String description = (request.getDescription() != null) ? request.getDescription().toLowerCase() : null;

        Page<Category> data = repository.filter(id, name, description, pageable);
        return pageMapper.map(data, mapper::toResponse);
    }

    public CategoryResponse create(CategoryRequest request) {
        User currentUser = SecurityUtils.getCurrentUser();
        Category c = mapper.of(request);
        c.setId(null);
        c.setCreatedBy(currentUser.getUsername());

        return mapper.toResponse(repository.save(c));
    }

    public CategoryResponse update(CategoryRequest request) {
        User currentUser = SecurityUtils.getCurrentUser();

        Category existed = validate(request.getId());

        existed.setName(request.getName());
        existed.setDescription(request.getDescription());
        existed.setModifiedBy(currentUser.getUsername());
        existed.setStatus(request.getStatus() == null ? EntityStatus.ACTIVE.getStatus() : request.getStatus());

        return mapper.toResponse(repository.save(existed));
    }

    private Category validate(Long id) {
        Optional<Category> check = repository.findByIdAndStatus(id, EntityStatus.ACTIVE.getStatus());
        if (check.isEmpty()) {
            throw new CustomException("category-not-exist");
        }
        return check.get();
    }
}
