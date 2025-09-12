package com.edward.cook_craft.service;

import com.edward.cook_craft.dto.request.IngredientRequest;
import com.edward.cook_craft.dto.response.IngredientResponse;
import com.edward.cook_craft.enums.EntityStatus;
import com.edward.cook_craft.exception.CustomException;
import com.edward.cook_craft.mapper.IngredientMapper;
import com.edward.cook_craft.model.Ingredient;
import com.edward.cook_craft.repository.IngredientRepository;
import com.edward.cook_craft.repository.UnitRepository;
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

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class IngredientService {

    @Value("${image.default.ingredient}")
    private String defaultIngredient;

    private final IngredientRepository repository;
    private final UnitRepository unitRepository;
    private final IngredientMapper ingredientMapper;
    private final MinioService minioService;

    public List<IngredientResponse> getAll() {
        return repository.findAll().stream()
                .map(ingredientMapper::toResponse).toList();
    }

    public IngredientResponse details(Long id) {
        Optional<Ingredient> optional = repository.findById(id);
        if (optional.isEmpty()) {
            throw new CustomException("ingredient.not.found");
        }
        return ingredientMapper.toResponse(optional.get());
    }

    public Page<IngredientResponse> filter(IngredientRequest request, Pageable pageable) {
        String search = (request.getSearch() == null || request.getSearch().isEmpty()) ? null : request.getSearch().toLowerCase();
        List<Long> unitIds = (request.getUnitIds() == null || request.getUnitIds().isEmpty()) ? null : request.getUnitIds();

        Page<Ingredient> page = repository.filter(search, unitIds, pageable);
        List<IngredientResponse> response = page.getContent().stream().map(ingredientMapper::toResponse).toList();
        return new PageImpl<>(response, pageable, page.getTotalElements());
    }

    @Transactional
    public IngredientResponse create(String jsonRequest, MultipartFile file) {
        IngredientRequest request = JsonUtils.jsonMapper(jsonRequest, IngredientRequest.class);
        validate(request);
        Ingredient i = ingredientMapper.of(request);
        i.setId(null);
        if (file != null && !file.isEmpty()) {
            i.setImgUrl(minioService.uploadFile(file));
        } else {
            i.setImgUrl(defaultIngredient);
        }
        return ingredientMapper.toResponse(repository.save(i));
    }

    @Transactional
    public IngredientResponse update(String jsonRequest, MultipartFile file) {
        IngredientRequest request = JsonUtils.jsonMapper(jsonRequest, IngredientRequest.class);
        validate(request);
        Ingredient existed = repository.findById(request.getId()).get();

        existed.setName(request.getName());
        existed.setUnitId(request.getUnitId());
        existed.setStatus(request.getStatus() == null ? EntityStatus.ACTIVE.getStatus() : request.getStatus());
        existed.setDescription(request.getDescription());
        if (file != null && !file.isEmpty()) {
            if (!defaultIngredient.equals(existed.getImgUrl())) {
                minioService.deleteFile(existed.getImgUrl());
            }
            existed.setImgUrl(minioService.uploadFile(file));
        }
        return ingredientMapper.toResponse(repository.save(existed));
    }

    private void validate(IngredientRequest request) {
        Long id = (request.getId() == null) ? null : request.getId();
        if (id != null && !repository.existsById(request.getId())) {
            throw new CustomException("ingredient.not.found");
        }
        if (request.getName() == null || request.getName().isEmpty()) {
            throw new CustomException("ingredient.name.empty");
        }

        if (request.getUnitId() == null || !unitRepository.existsById(request.getUnitId())) {
            throw new CustomException("unit.not.valid");
        }

        if (repository.checkDuplicateIngredient(request.getName(), request.getUnitId(), id)) {
            throw new CustomException("ingredient.duplicate");
        }
    }
}
