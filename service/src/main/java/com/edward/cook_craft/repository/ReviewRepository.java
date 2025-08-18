package com.edward.cook_craft.repository;

import com.edward.cook_craft.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    @Query(value = "SELECT rv " +
            "FROM Recipe rc " +
            "LEFT JOIN Review rv " +
            "ON rc.id = rv.recipeId " +
            "WHERE rc.authorUsername = :username " +
            "AND rc.status = 1 " +
            "AND rv.status = 1 ")
    List<Review> findAllReviewForUser(@Param("username") String username);
}
