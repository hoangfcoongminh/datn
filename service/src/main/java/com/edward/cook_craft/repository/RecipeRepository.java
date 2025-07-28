package com.edward.cook_craft.repository;

import com.edward.cook_craft.dto.request.RecipeFilterRequest;
import com.edward.cook_craft.model.Recipe;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {

    @Query(value = "SELECT r " +
            "FROM Recipe r " +
            "WHERE ")
    Page<Recipe> filter(@Param());
}
