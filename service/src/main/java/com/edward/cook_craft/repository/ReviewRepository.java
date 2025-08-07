package com.edward.cook_craft.repository;

import com.edward.cook_craft.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review,Long> {

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
    Optional<Review> findByUserIdAndRecipeId(Long userId, Long recipeId);
}
