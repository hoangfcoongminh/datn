package com.edward.cook_craft.repository;

import com.edward.cook_craft.model.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicineRepository extends JpaRepository<Recipe, Long> {
}
