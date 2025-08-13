package com.edward.cook_craft.repository;

import com.edward.cook_craft.model.Unit;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UnitRepository extends JpaRepository<Unit, Long> {

    @Query(value = "SELECT COUNT(u) > 0 " +
            "FROM Unit u " +
            "WHERE u.id = :id " +
            "AND u.status = 1")
    boolean existsById(@NotNull @Param("id") Long id);

    @Query(value = "SELECT COUNT(u) > 0 " +
            "FROM Unit u " +
            "WHERE u.name = :name " +
            "AND u.status = 1")
    boolean existsByName(@NotNull @Param("name") String name);

    @Query(value = "SELECT u " +
            "FROM Unit u " +
            "WHERE (:name IS NULL OR LOWER(u.name) LIKE CONCAT('%', :name, '%')) " +
            "AND u.status = 1")
    Page<Unit> filter(@Param("name") String name, Pageable pageable);

    @NotNull
    @Query(value = "SELECT u " +
            "FROM Unit u " +
            "WHERE u.id = :id " +
            "AND u.status = 1")
    Optional<Unit> findById(@NotNull @Param("id") Long id);
}
