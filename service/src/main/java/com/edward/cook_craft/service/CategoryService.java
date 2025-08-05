package com.edward.cook_craft.service;

import com.edward.cook_craft.dto.request.CategoryRequest;
import com.edward.cook_craft.dto.response.CategoryResponse;
import com.edward.cook_craft.dto.response.PagedResponse;
import com.edward.cook_craft.enums.EntityStatus;
import com.edward.cook_craft.exception.CustomException;
import com.edward.cook_craft.mapper.CategoryMapper;
import com.edward.cook_craft.mapper.PageMapper;
import com.edward.cook_craft.model.Category;
import com.edward.cook_craft.model.Recipe;
import com.edward.cook_craft.model.User;
import com.edward.cook_craft.repository.CategoryRepository;
import com.edward.cook_craft.repository.RecipeRepository;
import com.edward.cook_craft.service.minio.MinioService;
import com.edward.cook_craft.utils.JsonUtils;
import com.edward.cook_craft.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryService {

    @Value("${image.default.category}")
    private String defaultCategory;

    private final CategoryRepository repository;
    private final PageMapper pageMapper;
    private final CategoryMapper mapper;
    private final RecipeRepository recipeRepository;
    private final MinioService minioService;

    public List<CategoryResponse> getAll() {
        return repository.findAll().stream()
                .map(mapper::toResponse).toList();
    }

    public PagedResponse<CategoryResponse> filter(CategoryRequest request, Pageable pageable) {

        String search = (request.getSearch() != null) ? request.getSearch().toLowerCase() : null;

        Page<Category> data = repository.filter(search, pageable);
        return pageMapper.map(data, mapper::toResponse);
    }

    @Transactional
    public CategoryResponse create(String jsonRequest, MultipartFile file) {
        CategoryRequest request = JsonUtils.jsonMapper(jsonRequest, CategoryRequest.class);
        if (request.getName() == null || request.getName().isEmpty()) {
            throw new CustomException("name.cannot.be.blank");
        }
        if (repository.existsByName(request.getName())) {
            throw new CustomException("name.already.exists");
        }
        Category c = mapper.of(request);
        c.setId(null);
        if (file != null && !file.isEmpty()) {
            c.setImgUrl(minioService.uploadFile(file));
        } else {
            c.setImgUrl(defaultCategory);
        }
        c = repository.save(c);

        return mapper.toResponse(c);
    }

    @Transactional
    public CategoryResponse update(String jsonRequest, MultipartFile file) {
        CategoryRequest request = JsonUtils.jsonMapper(jsonRequest, CategoryRequest.class);
        Category existed = repository.findByIdAndActive(request.getId()).orElseThrow(() -> new CustomException("category-not-exist"));
        if (request.getName() == null || request.getName().isEmpty()) {
            throw new CustomException("name.cannot.be.blank");
        }
        if (!request.getName().equals(existed.getName()) && repository.existsByName(request.getName())) {
            throw new CustomException("name.already.exists");
        }
        existed.setName(request.getName());
        existed.setDescription(request.getDescription());
        if (file != null && !file.isEmpty()) {
            if (!defaultCategory.equals(existed.getImgUrl())) {
                minioService.deleteFile(existed.getImgUrl());
            }
            existed.setImgUrl(minioService.uploadFile(file));
        }
        existed.setStatus(request.getStatus() == null ? EntityStatus.ACTIVE.getStatus() : request.getStatus());
        existed = repository.save(existed);

        if (request.getStatus() != null) {
            List<Recipe> updateRecipeByCategory = recipeRepository.findAllByCategoryId(existed.getId());
            updateRecipeByCategory.forEach(r -> r.setStatus(request.getStatus()));

            recipeRepository.saveAll(updateRecipeByCategory);
        }

        return mapper.toResponse(existed);
    }
}
