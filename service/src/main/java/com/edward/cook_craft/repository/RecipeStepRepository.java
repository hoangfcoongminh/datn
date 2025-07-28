package com.edward.cook_craft.repository;

import com.edward.cook_craft.model.RecipeStep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RecipeStepRepository extends JpaRepository<RecipeStep, Long> {

    @Query(value = "SELECT r.id " +
            "FROM RecipeStep r " +
            "WHERE r.recipeId = :recipeId")
    List<Long> findByRecipeId(Long recipeId);
}
