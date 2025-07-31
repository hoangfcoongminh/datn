package com.edward.cook_craft.repository;

import com.edward.cook_craft.model.Unit;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UnitRepository extends JpaRepository<Unit, Long> {

    @Query(value = "SELECT COUNT(u) > 0 " +
            "FROM Unit u " +
            "WHERE u.id = :id " +
            "AND u.status = 1")
    boolean existsById(@NotNull @Param("id") Long id);
}
