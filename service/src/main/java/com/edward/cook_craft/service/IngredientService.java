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

    public PagedResponse<IngredientResponse> filter(IngredientRequest request, Pageable pageable) {
        String name = null;
        if (request.getName() != null && !request.getName().isEmpty()) {
            name = request.getName().toLowerCase();
        }
        Page<Ingredient> page = repository.filter(name, request.getUnitId(), pageable);

        return pageMapper.map(page, ingredientMapper::toResponse);
    }

    @Transactional
    public IngredientResponse create(IngredientRequest request) {
        validate(request);
        User currentUser = SecurityUtils.getCurrentUser();
        Ingredient i = ingredientMapper.of(request);
        i.setId(null);
        i.setCreatedBy(currentUser.getUsername());
        return ingredientMapper.toResponse(repository.save(i));
    }

    @Transactional
    public IngredientResponse update(IngredientRequest request) {
        validate(request);
        User currentUser = SecurityUtils.getCurrentUser();
        Ingredient existed = repository.findByIdAndStatus(request.getId(), EntityStatus.ACTIVE.getStatus()).get();

        existed.setName(request.getName());
        existed.setUnitId(request.getUnitId());
        existed.setModifiedBy(currentUser.getUsername());
        existed.setStatus(request.getStatus() == null ? EntityStatus.ACTIVE.getStatus(): request.getStatus());
        return ingredientMapper.toResponse(repository.save(existed));
    }

    private void validate(IngredientRequest request) {
        if (request.getId() != null && !repository.existsById(request.getId())) {
            throw new CustomException("ingredient-not-exist");
        }

        if (unitRepository.findById(request.getUnitId()).isEmpty()) {
            throw new CustomException("unit-not-found");
        }
    }
}
