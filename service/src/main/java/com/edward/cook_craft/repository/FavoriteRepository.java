package com.edward.cook_craft.repository;

import com.edward.cook_craft.dto.response.UserResponse;
import com.edward.cook_craft.model.Favorite;
import org.springframework.data.domain.Pageable;
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

    interface RecipeLikeCount {
        Long getRecipeId();

        Integer getLikeCount();
    }

    @Query(value = "SELECT f " +
            "FROM Favorite f " +
            "WHERE f.recipeId = :recipeId " +
            "AND f.status = 1")
    List<Favorite> findByRecipeId(@Param("recipeId") Long recipeId);

    @Query("SELECT COUNT(f) FROM Favorite f " +
            "JOIN Recipe rc ON rc.id = f.recipeId " +
            "WHERE rc.authorUsername = :username " +
            "AND rc.status = 1 " +
            "AND f.status = 1")
    int countTotalFavoriteForUser(@Param("username") String username);


    @Query("""
        SELECT new com.edward.cook_craft.dto.response.UserResponse(
            u.username,
            u.email,
            u.fullName,
            u.description,
            u.imgUrl,
            u.role,
            0,
            0,
            COUNT(f.id)
        )
        FROM User u
        LEFT JOIN Favorite f ON f.userId = u.id
        WHERE f.status = 1 AND u.status = 1
        GROUP BY u.id, u.username, u.email, u.fullName, u.description, u.imgUrl, u.role
        ORDER BY COUNT(f.id) DESC
    """)
    List<UserResponse> findTopUsersByFavorite(Pageable pageable);
}
