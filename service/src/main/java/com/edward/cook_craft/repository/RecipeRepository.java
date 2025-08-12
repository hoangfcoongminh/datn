package com.edward.cook_craft.repository;

import com.edward.cook_craft.model.Recipe;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {

    @Query(value = "SELECT DISTINCT r " +
            "FROM Recipe r " +
            "WHERE ((:keyword IS NULL OR LOWER(CONCAT(r.title, '#', COALESCE(r.description, ''))) LIKE CONCAT('%', :keyword, '%')) " +
            "AND (:categoryIds IS NULL OR r.categoryId IN :categoryIds) " +
            "AND (:authorUsernames IS NULL OR r.authorUsername IN :authorUsernames) " +
            "AND (:ingredientIds IS NULL OR EXISTS (SELECT 1 " +
            "                                       FROM RecipeIngredientDetail rid " +
            "                                       WHERE rid.recipeId = r.id " +
            "                                       AND rid.ingredientId IN :ingredientIds )))" +
            "AND (:status = -1 OR r.status = :status)")
    Page<Recipe> filter(@Param("keyword") String keyword,
                        @Param("categoryIds") List<Long> categoryIds,
                        @Param("ingredientIds") List<Long> ingredientIds,
                        @Param("authorUsernames") List<String> authorUsernames,
                        @Param("status") Integer status,
                        Pageable pageable);

    @Query(value = "SELECT r " +
            "FROM Recipe r " +
            "WHERE r.id = :id " +
            "AND r.status = 1")
    Optional<Recipe> getByIdAndActive(@Param("id") Long id);


    @Query(value = "SELECT r " +
            "FROM Recipe r " +
            "WHERE r.categoryId = :categoryId " +
            "AND r.status = 1")
    List<Recipe> findAllByCategoryId(@Param("categoryId") Long categoryId);

    @Query(value = "SELECT DISTINCT r " +
            "FROM Recipe r " +
            "LEFT JOIN Favorite f " +
            "ON r.id = f.recipeId " +
            "WHERE ((:keyword IS NULL OR LOWER(CONCAT(r.title, '#', COALESCE(r.description, ''))) LIKE CONCAT('%', :keyword, '%')) " +
            "AND (:categoryIds IS NULL OR r.categoryId IN :categoryIds) " +
            "AND (:authorUsernames IS NULL OR r.authorUsername IN :authorUsernames) " +
            "AND (:ingredientIds IS NULL OR EXISTS (SELECT 1 " +
            "                                       FROM RecipeIngredientDetail rid " +
            "                                       WHERE rid.recipeId = r.id " +
            "                                       AND rid.ingredientId IN :ingredientIds )))" +
            "AND (:status = -1 OR r.status = :status) " +
            "GROUP BY r " +
            "ORDER BY COUNT(f) DESC ")
    Page<Recipe> filterWithFavorite(@Param("keyword") String keyword,
                        @Param("categoryIds") List<Long> categoryIds,
                        @Param("ingredientIds") List<Long> ingredientIds,
                        @Param("authorUsernames") List<String> authorUsernames,
                        @Param("status") Integer status,
                        Pageable pageable);

    List<Recipe> findByCreatedAtBetween(LocalDateTime startOfYear, LocalDateTime endOfYear);

    @Query(value = "SELECT r " +
            "FROM Recipe r " +
            "WHERE r.categoryId = :categoryId " +
            "AND r.status = 1")
    List<Recipe> findByCategoryId(@Param("categoryId") Long categoryId);

    @Query(value = "SELECT r " +
            "FROM Recipe r " +
            "WHERE r.id IN :recipeIds " +
            "AND r.status = 1")
    List<Recipe> findAllByIdActive(@Param("recipeIds") List<Long> recipeIds);

    @Modifying
    @Query("UPDATE Recipe r " +
            "SET r.viewCount = r.viewCount + :views " +
            "WHERE r.id = :recipeId")
    void incrementViewCount(@Param("recipeId") Long recipeId, @Param("views") long views);

    @Query(value = "SELECT r " +
            "FROM Recipe r " +
            "WHERE r.status = 1 " +
            "ORDER BY r.viewCount DESC " +
            "LIMIT 10")
    List<Recipe> findTop10ViewRecipes();
}
