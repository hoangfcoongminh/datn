package com.edward.cook_craft.repository;

import com.edward.cook_craft.model.RecipeIngredientDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RecipeIngredientDetailRepository extends JpaRepository<RecipeIngredientDetail, Long> {

    @Query(value = "SELECT r.id " +
            "FROM RecipeIngredientDetail r " +
            "WHERE r.recipeId = :recipeId")
    List<Long> findByRecipeId(@Param("recipeId") Long recipeId);
}
