package com.edward.cook_craft.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * BẢNG YÊU THÍCH
 */

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "favorites",uniqueConstraints = @UniqueConstraint(columnNames = {"userId", "recipeId"}))
@SuperBuilder
public class Favorite extends BaseModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private Long recipeId;
}
