package com.edward.pharmacy.repository;

import com.edward.pharmacy.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
