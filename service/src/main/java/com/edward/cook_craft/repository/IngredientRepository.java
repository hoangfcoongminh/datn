package com.edward.cook_craft.repository;

import com.edward.cook_craft.model.Ingredient;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IngredientRepository extends JpaRepository<Ingredient, Long> {

    @NotNull
    @Query(value = "SELECT i " +
            "FROM Ingredient i " +
            "WHERE i.status = 1 ")
    List<Ingredient> findAll();

    @Query(value = "SELECT i " +
            "FROM Ingredient i " +
            "WHERE (:search IS NULL OR LOWER(i.name) LIKE CONCAT('%', :search, '%') " +
            "OR LOWER(i.description) LIKE CONCAT('%', :search, '%')) " +
            "AND (:unitIds IS NULL OR i.unitId IN :unitIds) " +
            "AND i.status = 1")
    Page<Ingredient> filter(@Param("search") String search,
                            @Param("unitIds") List<Long> unitIds,
                            Pageable pageable);

    @Query(value = "SELECT COUNT(i) > 0 " +
            "FROM Ingredient i " +
            "WHERE i.id = :id " +
            "AND i.status = 1")
    boolean existsById(@NotNull @Param("id") Long id);

    @Query(value = "SELECT COUNT(i) > 0 " +
            "FROM Ingredient i " +
            "WHERE (:id IS NULL OR i.id != :id) " +
            "AND i.name = :name " +
            "AND i.unitId = :unitId " +
            "AND i.status = 1 ")
    boolean checkDuplicateIngredient(@Param("name") String name,
                                     @Param("unitId") Long unitId,
                                     @Param("id") Long id);

    @Query("""
            SELECT i
            FROM Ingredient i
            WHERE (:search IS NULL
                   OR :search = ''
                   OR LOWER(i.name) LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(i.description) LIKE LOWER(CONCAT('%', :search, '%')))
            AND (:status IS NULL OR i.status = :status)
            """)
    Page<Ingredient> getAllIngredientsForAdmin(@Param("search") String search,
                                               @Param("status") Integer status,
                                               Pageable pageable);

}
