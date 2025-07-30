package com.edward.cook_craft.repository;

import com.edward.cook_craft.model.Recipe;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {

    @Query(value = "SELECT DISTINCT r " +
            "FROM Recipe r " +
            "LEFT JOIN RecipeIngredientDetail rid " +
            "ON r.id = rid.recipeId " +
            "WHERE (:keyword IS NULL OR LOWER(CONCAT(r.title, ' ', r.description)) LIKE CONCAT('%', :keyword, '%')) " +
            "AND (:categoryIds IS NULL OR r.categoryId IN :categoryIds) " +
            "AND (:ingredientIds IS NULL OR rid.ingredientId IN :ingredientIds) " +
            "AND (:authorIds IS NULL OR r.authorId IN :authorIds) " +
            "AND r.status = 1")
    Page<Recipe> filter(@Param("keyword") String keyword,
                        @Param("categoryIds") List<Long> categoryIds,
                        @Param("ingredientIds") List<Long> ingredientIds,
                        @Param("authorIds") List<Long> authorIds,
                        Pageable pageable);

    @Query(value = "SELECT r " +
            "FROM Recipe r " +
            "WHERE r.id = :id " +
            "AND r.status = 1")
    Optional<Recipe> getByIdAndActive(@Param("id") Long id);
}
