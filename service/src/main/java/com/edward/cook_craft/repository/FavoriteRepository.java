package com.edward.cook_craft.repository;

import com.edward.cook_craft.model.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    @Query(value = "SELECT f " +
            "FROM Favorite f " +
            "INNER JOIN Recipe r " +
            "ON f.recipeId = r.id " +
            "WHERE f.userId = :userId " +
            "AND r.status = 1")
    List<Favorite> findAllFavoriteByUserId(@Param("userId") Long userId);
}
