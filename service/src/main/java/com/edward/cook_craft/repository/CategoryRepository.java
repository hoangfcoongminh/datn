package com.edward.cook_craft.repository;

import com.edward.cook_craft.model.Category;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    @NotNull
    @Query(value = "SELECT c " +
            "FROM Category c " +
            "WHERE c.status = 1")
    List<Category> findAll();

    @Query(value = "SELECT c " +
            "FROM Category c " +
            "WHERE c.id = :id " +
            "AND c.status = 1 ")
    Optional<Category> findByIdAndActive(@Param("id") Long id);

    @Query(value = "SELECT c " +
            "FROM Category c " +
            "WHERE ((:search IS NULL OR LOWER(c.name) LIKE CONCAT('%', :search, '%')) " +
            "OR (:search IS NULL OR LOWER(c.description) LIKE CONCAT('%', :search, '%'))) " +
            "AND (c.status = 1) ")
    Page<Category> filter(@Param("search") String search,
                          Pageable pageable);

    @Query(value = "SELECT COUNT(c) > 0 " +
            "FROM Category c " +
            "WHERE c.name = :name " +
            "AND c.status = 1")
    boolean existsByName(@Param("name") String name);

    @Query("SELECT c " +
            "FROM Recipe r INNER JOIN Category c ON r.categoryId = c.id " +
            "WHERE r.createdAt >= :startOfMonth AND r.createdAt <= :endOfMonth " +
            "GROUP BY c.id, c.name, c.imgUrl, c.description " +
            "ORDER BY COUNT(r) DESC " +
            "LIMIT 4")
    List<Category> findTop4CategoriesByRecipeCount(
            @Param("startOfMonth") LocalDateTime startOfMonth,
            @Param("endOfMonth") LocalDateTime endOfMonth);

    @Query(value = "SELECT c " +
            "FROM Category c " +
            "WHERE (COALESCE(:search, '') = '' OR CONCAT(LOWER(c.name),'#',LOWER(c.description)) LIKE CONCAT('%',LOWER(:search),'%')) " +
            "AND (:status IS NULL OR c.status = :status)")
    Page<Category> getAllCategoriesForAdmin(@Param("search") String search,
                                            @Param("status") Integer status,
                                            Pageable pageable);
}
