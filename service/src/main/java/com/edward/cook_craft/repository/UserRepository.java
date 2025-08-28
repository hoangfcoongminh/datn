package com.edward.cook_craft.repository;

import com.edward.cook_craft.enums.EntityStatus;
import com.edward.cook_craft.enums.Role;
import com.edward.cook_craft.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    @Query(value = "SELECT u " +
            "FROM User u " +
            "WHERE u.status = 1")
    List<User> findAllAndActive();

    @Query(value = "SELECT u " +
            "FROM User u " +
            "WHERE u.id = :id " +
            "AND u.status = 1")
    Optional<User> findByIdAndActive(@Param("id") Long id);

    @Query(value = "SELECT u " +
            "FROM User u " +
            "WHERE u.username IN :usernames " +
            "AND u.status = 1")
    List<User> findByUsernameIn(@Param("usernames") List<String> usernames);

    @Query(value = "SELECT u " +
            "FROM User u " +
            "WHERE u.username = :username " +
            "AND u.status = 1")
    Optional<User> findByUsername(@Param("username") String username);

    List<User> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    @Query(value = "SELECT u " +
            "FROM User u " +
            "WHERE ((COALESCE(:search, '') = '' OR CONCAT('%',LOWER(u.username), '#', LOWER(u.fullName),'#',LOWER(u.email),'%') LIKE CONCAT('%',LOWER(:search),'%'))) " +
            "AND (:status IS NULL OR u.status = :status) " +
            "AND (:role IS NULL OR u.role = :role)")
    Page<User> getUserForAdmin(@Param("search") String search,
                               @Param("status") EntityStatus status,
                               @Param("role") Role role,
                               Pageable pageable);
}
