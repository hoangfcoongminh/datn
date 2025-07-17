package com.edward.cook_craft.repository;

import com.edward.cook_craft.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
