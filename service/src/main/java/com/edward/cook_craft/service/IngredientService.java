package com.edward.cook_craft.service;

import com.edward.cook_craft.dto.request.IngredientRequest;
import com.edward.cook_craft.dto.response.IngredientResponse;
import com.edward.cook_craft.dto.response.PagedResponse;
import com.edward.cook_craft.enums.EntityStatus;
import com.edward.cook_craft.exception.CustomException;
import com.edward.cook_craft.mapper.IngredientMapper;
import com.edward.cook_craft.mapper.PageMapper;
import com.edward.cook_craft.model.Ingredient;
import com.edward.cook_craft.model.User;
import com.edward.cook_craft.repository.IngredientRepository;
import com.edward.cook_craft.repository.UnitRepository;
import com.edward.cook_craft.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class IngredientService {

    private final IngredientRepository repository;
    private final UnitRepository unitRepository;
    private final IngredientMapper ingredientMapper;
    private final PageMapper pageMapper;

    public List<IngredientResponse> getAll() {
        return repository.findAll().stream()
                .map(ingredientMapper::toResponse).toList();
    }

    public IngredientResponse details(Long id) {
        Optional<Ingredient> optional = repository.findById(id);
        if (optional.isEmpty()) {
            throw new CustomException("ingredients.not.found");
        }
        return ingredientMapper.toResponse(optional.get());
    }

    public PagedResponse<IngredientResponse> filter(IngredientRequest request, Pageable pageable) {
        String search = (request.getSearch() == null || request.getSearch().isEmpty()) ? null : request.getSearch().toLowerCase();
        List<Long> unitIds = (request.getUnitIds() == null || request.getUnitIds().isEmpty()) ? null : request.getUnitIds();

        Page<Ingredient> page = repository.filter(search, unitIds, pageable);

        return pageMapper.map(page, ingredientMapper::toResponse);
    }

    @Transactional
    public IngredientResponse create(IngredientRequest request) {
        validate(request);
        Ingredient i = ingredientMapper.of(request);
        i.setId(null);
        return ingredientMapper.toResponse(repository.save(i));
    }

    @Transactional
    public IngredientResponse update(IngredientRequest request) {
        validate(request);
        Ingredient existed = repository.findById(request.getId()).get();

        existed.setName(request.getName());
        existed.setUnitId(request.getUnitId());
        existed.setStatus(request.getStatus() == null ? EntityStatus.ACTIVE.getStatus() : request.getStatus());
        return ingredientMapper.toResponse(repository.save(existed));
    }

    private void validate(IngredientRequest request) {
        if (request.getId() != null && !repository.existsById(request.getId())) {
            throw new CustomException("ingredient-not-exist");
        }

        if (unitRepository.existsById(request.getUnitId())) {
            throw new CustomException("unit-not-found");
        }

        if (repository.checkDuplicateIngredient(request.getName(), request.getUnitId())) {
            throw new CustomException("ingredient-duplicate");
        }
    }
}
