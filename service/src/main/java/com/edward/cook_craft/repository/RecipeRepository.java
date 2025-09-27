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

    @Query("""
                SELECT r
                FROM Recipe r
                WHERE r.status = 1
                  AND (:excludeIds IS NULL OR r.id NOT IN :excludeIds)
                ORDER BY r.viewCount DESC
            """)
    List<Recipe> findTopViewExcludeIds(@Param("excludeIds") List<Long> excludeIds);

    @Query(value = "SELECT r " +
            "FROM Recipe r " +
            "WHERE r.status = 1 " +
            "ORDER BY r.viewCount DESC " +
            "LIMIT 10")
    List<Recipe> findTop10ViewRecipes();

    // Top recipes theo số lượt favorite
    @Query("SELECT r " +
            "FROM Recipe r " +
            "JOIN Favorite f ON r.id = f.recipeId " +
            "WHERE r.status = 1 AND f.status = 1 " +
            "GROUP BY r " +
            "ORDER BY COUNT(f) DESC " +
            "LIMIT 10")
    List<Recipe> findMostFavoriteRecipes();

    // Top recipes theo viewCount
    @Query("SELECT r " +
            "FROM Recipe r " +
            "WHERE r.status = 1 " +
            "ORDER BY r.viewCount DESC " +
            "LIMIT 10")
    List<Recipe> findMostViewedRecipes();

    @Query("SELECT r " +
            "FROM Recipe r " +
            "WHERE r.createdAt >= :start AND r.createdAt <= :end " +
            "AND r.categoryId IN :categoryIds ")
    List<Recipe> findTotalRecipeInMonthByCategory(@Param("start") LocalDateTime start,
                                                  @Param("end") LocalDateTime end,
                                                  @Param("categoryIds") List<Long> categoryIds);

    @Query(value = "SELECT r " +
            "FROM Recipe r " +
            "WHERE (COALESCE(:search, '') = '' OR CONCAT(LOWER(r.title),'#',LOWER(r.description)) LIKE CONCAT('%',LOWER(:search),'%')) " +
            "AND (:categoryIds IS NULL OR r.categoryId IN :categoryIds) " +
            "AND (:authorUsernames IS NULL OR r.authorUsername IN :authorUsernames) " +
            "AND (:status IS NULL OR r.status = :status) ")
    Page<Recipe> getAllRecipesForAdmin(@Param("search") String search,
                                       @Param("categoryIds") List<Long> categoryIds,
                                       @Param("authorUsernames") List<String> authorUsernames,
                                       @Param("status") Integer status,
                                       Pageable pageable);

    List<Recipe> findAllByCreatedAtAfter(LocalDateTime createdAtAfter);

    @Query(value = "SELECT r " +
            "FROM Favorite f " +
            "INNER JOIN Recipe r " +
            "ON r.id = f.recipeId " +
            "INNER JOIN User u " +
            "ON f.userId = u.id " +
            "WHERE u.username = :username " +
            "AND f.status = 1 " +
            "AND r.status = 1")
    Page<Recipe> getFavoritesByUsername(@Param("username") String username, Pageable pageable);
}
