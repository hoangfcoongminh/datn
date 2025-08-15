package com.edward.cook_craft.repository;

import com.edward.cook_craft.model.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    @Query(value = "SELECT f " +
            "FROM Favorite f " +
            "INNER JOIN Recipe r " +
            "ON f.recipeId = r.id " +
            "WHERE f.userId = :userId " +
            "AND r.status = 1 " +
            "AND f.status = 1")
    List<Favorite> findAllFavoriteByUserId(@Param("userId") Long userId);

    @Query(value = "SELECT f " +
            "FROM Favorite f " +
            "WHERE f.userId = :userId " +
            "AND f.recipeId IN :recipeIds " +
            "AND f.status = 1")
    List<Favorite> findAllFavoriteByUserIdAndRecipeIds(@Param("userId") Long userId,
                                                       @Param("recipeIds") List<Long> recipeIds);

    @Query(value = "SELECT f " +
            "FROM Favorite f " +
            "WHERE f.userId = :userId " +
            "AND f.recipeId = :recipeId ")
    Optional<Favorite> findByUserIdAndRecipeId(@Param("userId") Long userId,
                                               @Param("recipeId") Long recipeId);

    @Query("SELECT f.recipeId AS recipeId, COUNT(f.id) AS likeCount " +
            "FROM Favorite f " +
            "WHERE f.recipeId IN :recipeIds " +
            "AND f.status = 1 " +
            "GROUP BY f.recipeId")
    List<RecipeLikeCount> countLikesGroupByRecipeIdByRecipeIds(@Param("recipeIds") List<Long> recipeIds);

    @Query(value = "SELECT f " +
            "FROM Favorite f " +
            "WHERE f.recipeId = :recipeId " +
            "AND f.status = 1")
    List<Favorite> findByRecipeId(@Param("recipeId") Long recipeId);

    @Query(value = "SELECT f " +
            "FROM Favorite f " +
            "INNER JOIN Recipe r " +
            "ON f.recipeId = r.id " +
            "WHERE r.authorUsername = :username " +
            "AND r.status = 1 " +
            "AND f.status = 1 ")
    List<Favorite> findTotalFavoriteForUser(@Param("username") String username);

    interface RecipeLikeCount {
        Long getRecipeId();
        Integer getLikeCount();
    }
}
