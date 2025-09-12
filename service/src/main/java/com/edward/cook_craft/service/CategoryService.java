package com.edward.cook_craft.service;

import com.edward.cook_craft.dto.request.CategoryRequest;
import com.edward.cook_craft.dto.response.CategoryResponse;
import com.edward.cook_craft.enums.EntityStatus;
import com.edward.cook_craft.exception.CustomException;
import com.edward.cook_craft.mapper.CategoryMapper;
import com.edward.cook_craft.model.Category;
import com.edward.cook_craft.model.Recipe;
import com.edward.cook_craft.repository.CategoryRepository;
import com.edward.cook_craft.repository.RecipeRepository;
import com.edward.cook_craft.service.minio.MinioService;
import com.edward.cook_craft.utils.JsonUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    @Value("${image.default.category}")
    private String defaultCategory;

    private final CategoryRepository repository;
    private final CategoryMapper mapper;
    private final RecipeRepository recipeRepository;
    private final MinioService minioService;

    public List<CategoryResponse> getAll() {
        return repository.findAll().stream()
                .map(mapper::toResponse).toList();
    }

    public Page<CategoryResponse> filter(CategoryRequest request, Pageable pageable) {

        String search = (request.getSearch() != null) ? request.getSearch().toLowerCase() : null;

        Page<Category> data = repository.filter(search, pageable);
        return new PageImpl<>(data.getContent().stream().map(mapper::toResponse).toList(), pageable, data.getTotalElements());
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
        Category existed = repository.findByIdAndActive(request.getId()).orElseThrow(() -> new CustomException("category.not.exist"));
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

    public List<CategoryResponse> getPopular() {
        // Lấy tháng hiện tại
        YearMonth currentMonth = YearMonth.now();
        YearMonth lastMonth = currentMonth.minusMonths(1);

        // Tính startOfMonth
        LocalDateTime startOfMonth = currentMonth.atDay(1).atStartOfDay();
        LocalDateTime startOfLastMonth = lastMonth.atDay(1).atStartOfDay();

        // Tính endOfMonth
        LocalDateTime endOfMonth = currentMonth.atEndOfMonth().atTime(23, 59, 59);
        LocalDateTime endOfLastMonth = currentMonth.atDay(1).atStartOfDay();

        List<Category> data = repository.findTop4CategoriesByRecipeCount(startOfMonth, endOfMonth);
        if (data.isEmpty()) {
            data = repository.findTop4CategoriesByRecipeCount(startOfLastMonth, endOfLastMonth);
        }
        var categoryIds = data.stream().map(Category::getId).toList();

        var totalOfCatLastMonth = recipeRepository.findTotalRecipeInMonthByCategory(startOfLastMonth, endOfLastMonth, categoryIds)
                .stream().collect(Collectors.groupingBy(Recipe::getCategoryId, Collectors.counting()));

        var totalOfCatThisMonth = recipeRepository.findTotalRecipeInMonthByCategory(startOfMonth, endOfMonth, categoryIds)
                .stream().collect(Collectors.groupingBy(Recipe::getCategoryId, Collectors.counting()));

        var response = data.stream().map(mapper::toResponse).toList();

        response.forEach(r -> {
            Long lastTotal = totalOfCatLastMonth.get(r.getId());
            Long thisTotal = totalOfCatThisMonth.get(r.getId());

            float growth;

            if (thisTotal == null) {
                growth = 0f; // tháng này không có dữ liệu → growth = 0
            } else if (lastTotal == null || lastTotal == 0) {
                growth = (float) thisTotal * 100f; // tháng trước không có dữ liệu → coi là tăng trưởng 100%
            } else {
                growth = ((float) thisTotal / lastTotal) * 100 - 100; // tính % tăng trưởng thực sự
            }

            r.setGrowth(growth);
        });

        return response;
    }
}
