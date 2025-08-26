package com.edward.cook_craft.service.chatbot;

import com.edward.cook_craft.dto.RecipeTrainingDTO;
import com.edward.cook_craft.model.*;
import com.edward.cook_craft.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrainingDataService {

    private final RecipeRepository recipeRepo;
    private final RecipeStepRepository stepRepo;
    private final RecipeIngredientDetailRepository ridRepo;
    private final IngredientRepository ingredientRepo;
    private final UnitRepository unitRepo;
    private final CategoryRepository categoryRepo;

    public List<RecipeTrainingDTO> exportTrainingData() {
        // 1. Lấy tất cả recipes
        List<Recipe> recipes = recipeRepo.findAll();

        // 2. Lấy tất cả categories và đưa vào map
        Map<Long, String> categoryMap = categoryRepo.findAll().stream()
                .collect(Collectors.toMap(Category::getId, Category::getName));

        // 3. Lấy tất cả steps
        Map<Long, List<String>> stepsMap = stepRepo.findAllByOrderByRecipeIdAscStepNumberAsc()
                .stream()
                .collect(Collectors.groupingBy(
                        RecipeStep::getRecipeId,
                        Collectors.mapping(RecipeStep::getStepInstruction, Collectors.toList())
                ));

        // 4. Lấy tất cả nguyên liệu chi tiết
        List<RecipeIngredientDetail> allDetails = ridRepo.findAll();

        // 5. Lấy map Ingredient và Unit
        Map<Long, Ingredient> ingredientMap = ingredientRepo.findAll().stream()
                .collect(Collectors.toMap(Ingredient::getId, ing -> ing));
        Map<Long, Unit> unitMap = unitRepo.findAll().stream()
                .collect(Collectors.toMap(Unit::getId, u -> u));

        // 6. Group nguyên liệu theo recipe_id
        Map<Long, List<RecipeTrainingDTO.IngredientDTO>> ingredientMapByRecipe = allDetails.stream()
                .collect(Collectors.groupingBy(
                        RecipeIngredientDetail::getRecipeId,
                        Collectors.mapping(detail -> {
                            Ingredient ing = ingredientMap.get(detail.getIngredientId());
                            Unit unit = unitMap.get(detail.getActualUnitId());
                            return new RecipeTrainingDTO.IngredientDTO(
                                    ing != null ? ing.getName() : "",
                                    detail.getQuantity(),
                                    unit != null ? unit.getName() : ""
                            );
                        }, Collectors.toList())
                ));

        // 7. Build DTO list
        return recipes.stream().map(r -> new RecipeTrainingDTO(
                r.getId(),
                r.getTitle(),
                categoryMap.getOrDefault(r.getCategoryId(), "Không xác định"),
                r.getDescription(),
                r.getPrepTime(),
                r.getCookTime(),
                r.getServings(),
                ingredientMapByRecipe.getOrDefault(r.getId(), new ArrayList<>()),
                stepsMap.getOrDefault(r.getId(), new ArrayList<>())
        )).collect(Collectors.toList());
    }

}
