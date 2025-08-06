package com.edward.cook_craft.service;

import com.edward.cook_craft.dto.request.RecipeFilterRequest;
import com.edward.cook_craft.dto.request.RecipeIngredientDetailRequest;
import com.edward.cook_craft.dto.request.RecipeRequest;
import com.edward.cook_craft.dto.request.RecipeStepRequest;
import com.edward.cook_craft.dto.response.*;
import com.edward.cook_craft.enums.EntityStatus;
import com.edward.cook_craft.exception.CustomException;
import com.edward.cook_craft.mapper.PageMapper;
import com.edward.cook_craft.mapper.RecipeIngredientDetailMapper;
import com.edward.cook_craft.mapper.RecipeMapper;
import com.edward.cook_craft.mapper.RecipeStepMapper;
import com.edward.cook_craft.model.Recipe;
import com.edward.cook_craft.model.RecipeIngredientDetail;
import com.edward.cook_craft.model.RecipeStep;
import com.edward.cook_craft.model.User;
import com.edward.cook_craft.repository.*;
import com.edward.cook_craft.service.minio.MinioService;
import com.edward.cook_craft.utils.JsonUtils;
import com.edward.cook_craft.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecipeService {

    @Value("${image.default.recipe}")
    private String defaultRecipe;

    private final RecipeRepository repository;
    private final CategoryRepository categoryRepository;
    private final RecipeIngredientDetailRepository recipeIngredientDetailRepository;
    private final RecipeStepRepository recipeStepRepository;
    private final UserRepository userRepository;
    private final RecipeMapper recipeMapper;
    private final PageMapper pageMapper;
    private final MinioService minioService;
    private final RecipeIngredientDetailMapper recipeIngredientDetailMapper;
    private final RecipeStepMapper recipeStepMapper;
    private final FavoriteRepository favoriteRepository;

    public List<RecipeResponse> getAll() {
        return repository.findAll().stream()
                .map(recipeMapper::toResponse).toList();
    }

    public PagedResponse<?> filter(RecipeFilterRequest request, Pageable pageable) {
        String keyword = request.getKeyword() == null || request.getKeyword().isEmpty() ? null : request.getKeyword().toLowerCase();
        List<Long> categoryIds = request.getCategoryIds() == null || request.getCategoryIds().isEmpty() ? null : request.getCategoryIds();
        List<Long> ingredientIds = request.getIngredientIds() == null || request.getIngredientIds().isEmpty() ? null : request.getIngredientIds();
        List<String> authorUsernames = request.getAuthorUsernames() == null || request.getAuthorUsernames().isEmpty() ? null : request.getAuthorUsernames();
        Integer status = request.getStatus() == null ? EntityStatus.ACTIVE.getStatus() : request.getStatus();
        boolean sortByFavorite = pageable.getSort().stream()
                .anyMatch(order -> order.getProperty().equalsIgnoreCase("favorite"));
        List<Recipe> data;
        if (sortByFavorite) {
            data = repository.filterWithFavorite(
                    keyword, categoryIds, ingredientIds, authorUsernames, status, PageRequest.of(pageable.getPageNumber(), pageable.getPageSize())
            );
        } else {
            data = repository.filter(
                    keyword, categoryIds, ingredientIds, authorUsernames, status, pageable);
        }

        List<RecipeResponse> response = data.stream().map(recipeMapper::toResponse).toList();
        response.forEach(r -> {
            r.setIsFavorite(checkFavorite(r.getId()));
        });

        return pageMapper.map(response, pageable, response.size());
    }

    public RecipeDetailResponse details(Long id) {
        Optional<Recipe> recipe = repository.findById(id);
        if (recipe.isEmpty()) {
            throw new CustomException("recipe.not.found");
        }
        Recipe recipeData = recipe.get();
        RecipeDetailResponse response = new RecipeDetailResponse(recipeMapper.toResponse(recipeData));
        response.setIsFavorite(checkFavorite(id));

        List<RecipeIngredientDetail> recipeIngredients = recipeIngredientDetailRepository.findByRecipeId(id);
        var recipeIngredientResponses = recipeIngredients.stream()
                .map(recipeIngredientDetailMapper::toResponse).toList();
        List<RecipeStep> recipeSteps = recipeStepRepository.findByRecipeId(id);
        var recipeStepResponses = recipeSteps.stream()
                .map(recipeStepMapper::toResponse).toList();

        response.setRecipeIngredients(recipeIngredientResponses);
        response.setRecipeSteps(recipeStepResponses);
        return response;
    }

    @Transactional
    public RecipeDetailResponse create(String jsonRequest, MultipartFile file) {
        RecipeRequest request = JsonUtils.jsonMapper(jsonRequest, RecipeRequest.class);
        validateRecipeRequest(request);
        var ingredients = request.getIngredients();
        var steps = request.getSteps();

        Recipe recipe = recipeMapper.of(request);
        recipe.setId(null);
        if (file != null && !file.isEmpty()) {
            recipe.setImgUrl(minioService.uploadFile(file));
        } else {
            recipe.setImgUrl(defaultRecipe);
        }
        Recipe finalRecipe = repository.save(recipe);

        var savedIngredients = ingredients.stream().map(i -> {
            RecipeIngredientDetail ingredient = new RecipeIngredientDetail();
            ingredient.setRecipeId(finalRecipe.getId());
            ingredient.setIngredientId(i.getIngredientId());
            ingredient.setActualUnitId(i.getActualUnitId());
            ingredient.setQuantity(i.getQuantity());

            return ingredient;
        }).toList();

        var savedSteps = steps.stream().map(s -> {
            RecipeStep recipeStep = new RecipeStep();
            recipeStep.setRecipeId(finalRecipe.getId());
            recipeStep.setStepNumber(s.getStepNumber());
            recipeStep.setStepInstruction(s.getStepInstruction());

            return recipeStep;
        }).toList();

        recipeIngredientDetailRepository.saveAll(savedIngredients);
        recipeStepRepository.saveAll(savedSteps);

        return details(finalRecipe.getId());
    }

    @Transactional
    public RecipeResponse update(String jsonRequest, MultipartFile file) {
        RecipeRequest request = JsonUtils.jsonMapper(jsonRequest, RecipeRequest.class);
        validateRecipeRequest(request);
        if (!Objects.equals(SecurityUtils.getCurrentUsername(), request.getAuthorUsername())) {
            throw new CustomException("you.are.not.authorized");
        }
        Recipe recipe = repository.getByIdAndActive(request.getId()).get();
        updateRecipeData(recipe, request, file);

        return details(recipe.getId());
    }

    private void validateRecipeRequest(RecipeRequest request) {
        if (request.getId() != null && repository.getByIdAndActive(request.getId()).isEmpty()) {
            throw new CustomException("recipe.not.found");
        }

        if (request.getCategoryId() == null || categoryRepository.findByIdAndActive(request.getCategoryId()).isEmpty()) {
            throw new CustomException("category.cannot.null.or.not.found");
        }

        if (request.getAuthorUsername() == null || userRepository.findByUsername(request.getAuthorUsername()).isEmpty()) {
            throw new CustomException("user.not.found");
        }

        if (request.getTitle() == null || request.getTitle().isEmpty()) {
            throw new CustomException("recipe.title.cannot.empty");
        }
        var existIngredients = new ArrayList<>();
        var recipeIngredients = request.getIngredients();
        recipeIngredients.forEach(i -> {
            if (existIngredients.contains(i.getIngredientId())) {
                throw new CustomException("ingredient.cannot.duplicate");
            } else {
                existIngredients.add(i.getIngredientId());
            }
            if (i.getQuantity() == null || i.getQuantity().compareTo(BigDecimal.ZERO) <= 0) {
                throw new CustomException("ingredient.quantity.cannot.empty");
            }
        });

    }

    private void updateRecipeData(Recipe r, RecipeRequest request, MultipartFile file) {
        r.setCategoryId(request.getCategoryId());
        r.setTitle(request.getTitle());
        r.setDescription(request.getDescription());
        r.setPrepTime(request.getPrepTime());
        r.setCookTime(request.getCookTime());
        r.setServings(request.getServings());
        r.setStatus(request.getStatus() == null ? EntityStatus.ACTIVE.getStatus() : request.getStatus());
        if (file != null && !file.isEmpty()) {
            if (!defaultRecipe.equals(r.getImgUrl())) {
                minioService.deleteFile(r.getImgUrl());
            }
            r.setImgUrl(minioService.uploadFile(file));
        }
        updateRecipeIngredient(r.getId(), request.getIngredients());
        updateRecipeStep(r.getId(), request.getSteps());
    }

    private void updateRecipeIngredient(Long recipeId, List<RecipeIngredientDetailRequest> ingredients) {
        var ingredientMap = ingredients.stream().collect(Collectors.toMap(RecipeIngredientDetailRequest::getIngredientId, i -> i));
        List<Long> ingredientIds = ingredients.stream().map(RecipeIngredientDetailRequest::getIngredientId).toList();

        var ingredientList = recipeIngredientDetailRepository.findByRecipeId(recipeId)
                .stream().collect(Collectors.toMap(RecipeIngredientDetail::getIngredientId, i -> i));
        var ingredientIdList = new ArrayList<>(ingredientList.keySet());

        var newIngredientIds = new ArrayList<Long>();
        var updateIngredientIds = new ArrayList<Long>();
        var deletedIngredientIds = new ArrayList<Long>();

        ingredientIds.forEach(i -> {
            if (ingredientIdList.contains(i)) {
                updateIngredientIds.add(i);
            } else {
                newIngredientIds.add(i);
            }
        });
        ingredientIdList.forEach(i -> {
            if (!ingredientIds.contains(i)) {
                deletedIngredientIds.add(i);
            }
        });
        var newIngredients = newIngredientIds.stream().map(id -> {

            var ingredient = recipeIngredientDetailMapper.of(ingredientMap.get(id));
            ingredient.setId(null);
            ingredient.setRecipeId(recipeId);
            return ingredient;
        }).toList();
        var savedNewIngredients = recipeIngredientDetailRepository.saveAll(newIngredients);

        var updateIngredients = updateIngredientIds.stream().map(id -> {

            var existingIngredient = ingredientList.get(id);
            var updateIngredient = ingredientMap.get(id);
            existingIngredient.setActualUnitId(updateIngredient.getActualUnitId());
            existingIngredient.setQuantity(updateIngredient.getQuantity());
            return existingIngredient;
        }).toList();
        var savedUpdateIngredients = recipeIngredientDetailRepository.saveAll(updateIngredients);

        var deleteIngredients = deletedIngredientIds.stream().map(id -> {
            var existingIngredient = ingredientList.get(id);
            existingIngredient.setStatus(EntityStatus.IN_ACTIVE.getStatus());
            return existingIngredient;
        }).toList();
        recipeIngredientDetailRepository.saveAll(deleteIngredients);
    }

    private void updateRecipeStep(Long recipeId, List<RecipeStepRequest> steps) {
        List<RecipeStep> existingSteps = recipeStepRepository.findByRecipeId(recipeId);
        steps.sort(Comparator.comparing(RecipeStepRequest::getStepNumber));
        existingSteps.sort(Comparator.comparing(RecipeStep::getStepNumber));
        int newStepCount = steps.size(), existingStepCount = existingSteps.size();

        var newStep = new ArrayList<RecipeStep>();
        var updateStep = new ArrayList<RecipeStep>();

        for (int i = 0; i < newStepCount; i++) {
            if (i + 1 > existingStepCount) {
                var step = recipeStepMapper.of(steps.get(i));
                step.setId(null);
                step.setRecipeId(recipeId);
                newStep.add(step);
            } else {
                var step = existingSteps.get(i);
                step.setStepInstruction(steps.get(i).getStepInstruction());
                updateStep.add(step);
            }
        }
        if (newStepCount < existingStepCount) {
            for (int i = newStepCount; i < existingStepCount; i++) {
                var step = existingSteps.get(i);
                step.setStatus(EntityStatus.IN_ACTIVE.getStatus());
                updateStep.add(step);
            }
        }
        List<RecipeStep> savedNewStep = new ArrayList<>();
        if (!newStep.isEmpty()) {
            savedNewStep = recipeStepRepository.saveAll(newStep);
        }
        List<RecipeStep> savedUpdateStep = new ArrayList<>();
        if (!updateStep.isEmpty()) {
            savedUpdateStep = recipeStepRepository.saveAll(updateStep);
        }
    }

    private Boolean checkFavorite(Long recipeId) {
        User u = SecurityUtils.getCurrentUser();
        if (u != null) {
            return favoriteRepository.existsByUserIdAndRecipeId(u.getId(), recipeId);
        }
        return null;
    }
}
