package com.edward.cook_craft.model;

import com.edward.cook_craft.dto.request.RecipeIngredientDetailRequest;
import com.edward.cook_craft.dto.response.RecipeIngredientDetailResponse;
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
public class RecipeIngredientDetail extends BaseModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long recipeId;

    private Long ingredientId;

    private Long actualUnitId;

    private BigDecimal quantity;

    public static RecipeIngredientDetail of(RecipeIngredientDetailRequest request) {
        return RecipeIngredientDetail.builder()
                .recipeId(request.getRecipeId())
                .ingredientId(request.getIngredientId())
                .actualUnitId(request.getActualUnitId())
                .quantity(request.getQuantity())
                .build();
    }

    public static RecipeIngredientDetailResponse toResponse(RecipeIngredientDetail data) {
        return RecipeIngredientDetailResponse.builder()
                .id(data.getId())
                .recipeId(data.getRecipeId())
                .ingredientId(data.getIngredientId())
                .actualUnitId(data.getActualUnitId())
                .quantity(data.getQuantity())
                .build();
    }
}
