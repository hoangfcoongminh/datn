package com.edward.cook_craft.repository;

import com.edward.cook_craft.dto.response.UserResponse;
import com.edward.cook_craft.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query(value = "SELECT r " +
            "FROM Review r " +
            "WHERE r.recipeId = :recipeId " +
            "AND r.status = 1")
    Page<Review> findByRecipeId(Long recipeId, Pageable pageable);

    @Query(value = "SELECT r " +
            "FROM Review r " +
            "WHERE r.recipeId IN :recipeIds " +
            "AND r.status = 1")
    List<Review> findByRecipeIdIn(@Param("recipeIds") List<Long> recipeIds);

    @Query(value = "SELECT r " +
            "FROM Review r " +
            "WHERE r.recipeId = :recipeId " +
            "AND r.userId = :userId " +
            "AND r.status = 1")
    Optional<Review> findByUserIdAndRecipeId(@Param("userId") Long userId, @Param("recipeId") Long recipeId);

    @Query(value = "SELECT r " +
            "FROM Review r " +
            "WHERE r.userId = :userId " +
            "AND r.status = 1")
    List<Review> findByUserId(@Param("userId") Long userId);

    @Query(value = "SELECT r " +
            "FROM Review r " +
            "WHERE r.status = 1 ")
    List<Review> findAllActive();

    @Query(value = "SELECT r " +
            "FROM Review r " +
            "WHERE r.recipeId = :recipeId " +
            "AND r.status = 1 ")
    List<Review> findByRecipeIdAndActive(@Param("recipeId") Long recipeId);

    @Query(value = "SELECT r " +
            "FROM Review r " +
            "WHERE r.username = :username " +
            "AND r.status = 1")
    List<Review> findByUsername(@Param("username") String username);

    @Query("SELECT rv FROM Review rv " +
            "JOIN Recipe rc ON rc.id = rv.recipeId " +
            "WHERE rc.authorUsername = :username " +
            "AND rc.status = 1 " +
            "AND rv.status = 1")
    List<Review> findAllReviewForUser(@Param("username") String username);


    @Query("""
    SELECT new com.edward.cook_craft.dto.response.UserResponse(
        u.username,
        u.email,
        u.fullName,
        u.description,
        u.imgUrl,
        u.role,
        COUNT(r.id),
        COALESCE(AVG(r.rating), 0),
        (SELECT COUNT(f.id) FROM Favorite f WHERE f.userId = u.id AND f.status = 1)
    )
    FROM User u
    LEFT JOIN Review r ON u.id = r.userId
    WHERE u.status = 1 AND r.status = 1
    GROUP BY u.id, u.username, u.email, u.fullName, u.description, u.imgUrl, u.role
    ORDER BY AVG(r.rating) DESC
    """)
    List<UserResponse> findTopUsersByRating(Pageable pageable);

    List<Review> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}
