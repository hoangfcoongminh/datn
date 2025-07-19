package com.edward.cook_craft.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

/**
 * BẢNG CHI TIẾT CÔNG THỨC_NGUYÊN LIỆU
 */

@Entity
@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "recipe_ingredient_details")
public class RecipeIngredientDetail extends BaseModel{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long recipeId;

    private Long ingredientId;

    private Long actualUnitId;

    private BigDecimal quantity;

}
