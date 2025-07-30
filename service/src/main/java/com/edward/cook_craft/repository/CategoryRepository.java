package com.edward.cook_craft.repository;

import com.edward.cook_craft.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Query(value = "SELECT c " +
            "FROM Category c " +
            "WHERE c.id = :id " +
            "AND c.status = 1 ")
    Optional<Category> findByIdAndActive(@Param("id") Long id);

    @Query(value = "SELECT c " +
            "FROM Category c " +
            "WHERE (:search IS NULL OR LOWER(c.name) LIKE CONCAT('%', :search, '%')) " +
            "OR (:search IS NULL OR LOWER(c.description) LIKE CONCAT('%', :search, '%')) " +
            "AND c.status = 1")
    Page<Category> filter(@Param("search") String search,
                          Pageable pageable);
}
