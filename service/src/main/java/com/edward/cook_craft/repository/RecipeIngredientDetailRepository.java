package com.edward.cook_craft.repository;

import com.edward.cook_craft.model.RecipeIngredientDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RecipeIngredientDetailRepository extends JpaRepository<RecipeIngredientDetail, Long> {

    @Query(value = "SELECT r " +
            "FROM RecipeIngredientDetail r " +
            "WHERE r.recipeId = :recipeId " +
            "AND r.status = 1")
    List<RecipeIngredientDetail> findByRecipeId(@Param("recipeId") Long recipeId);

    List<RecipeIngredientDetail> findByIngredientId(Long ingredientId);
}
