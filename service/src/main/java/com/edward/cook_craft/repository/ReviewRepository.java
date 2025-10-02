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
                COUNT(rw.id),
                COALESCE(AVG(rw.rating), 0),
                (SELECT COUNT(f.id)
                 FROM Favorite f
                 JOIN Recipe r2 ON f.recipeId = r2.id
                 WHERE r2.authorUsername = u.username AND f.status = 1)
            )
            FROM User u
            JOIN Recipe rc ON rc.authorUsername = u.username AND rc.status = 1
            LEFT JOIN Review rw ON rw.recipeId = rc.id AND rw.status = 1
            WHERE u.status = 1
            GROUP BY u.id, u.username, u.email, u.fullName, u.description, u.imgUrl, u.role
            ORDER BY COALESCE(AVG(rw.rating), 0) DESC
            """)
    List<UserResponse> findTopUsersByRating(Pageable pageable);



    List<Review> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}
