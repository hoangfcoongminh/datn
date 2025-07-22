package com.edward.cook_craft.repository;

import com.edward.cook_craft.model.Ingredient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IngredientRepository extends JpaRepository<Ingredient, Long> {

    Optional<Ingredient> findByIdAndStatus(Long id, Integer status);

    @Query(value = "SELECT i " +
            "FROM Ingredient i " +
            "WHERE (:name IS NULL OR i.name LIKE CONCAT('%', :name, '%')) " +
            "AND (:unitId IS NULL OR i.unitId = :unitId) " +
            "AND i.status = 1")
    Page<Ingredient> filter(@Param("name") String name,
                            @Param("unitId") Long unitId,
                            Pageable pageable);
}
