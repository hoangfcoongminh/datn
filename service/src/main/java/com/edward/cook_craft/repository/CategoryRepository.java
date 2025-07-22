package com.edward.cook_craft.repository;

import com.edward.cook_craft.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByIdAndStatus(Long id, Integer status);

    @Query(value = "SELECT c " +
            "FROM Category c " +
            "WHERE (:id IS NULL OR :id = c.id) " +
            "AND (:name IS NULL OR c.name LIKE CONCAT('%', :name, '%')) " +
            "AND (:description IS NULL OR c.description LIKE CONCAT('%', :description, '%')) " +
            "AND c.status = 1")
    Page<Category> filter(@Param("id") Long id,
                          @Param("name") String name,
                          @Param("description") String description,
                          Pageable pageable);
}
