package com.edward.cook_craft.service;

import com.edward.cook_craft.dto.request.IngredientRequest;
import com.edward.cook_craft.dto.response.IngredientResponse;
import com.edward.cook_craft.model.Ingredient;
import com.edward.cook_craft.repository.IngredientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IngredientService {

    private final IngredientRepository repository;

    public List<IngredientResponse> getAll() {
        return repository.findAll().stream()
                .map(Ingredient::toResponse).toList();
    }

    public IngredientResponse create(IngredientRequest request) {
        return Ingredient.toResponse(repository.save(Ingredient.of(request)));
    }
}
