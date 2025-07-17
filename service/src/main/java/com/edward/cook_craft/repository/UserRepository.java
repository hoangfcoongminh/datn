package com.edward.cook_craft.repository;

import com.edward.cook_craft.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
