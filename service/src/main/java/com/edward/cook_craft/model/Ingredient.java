package com.edward.cook_craft.model;

import com.edward.cook_craft.dto.request.IngredientRequest;
import com.edward.cook_craft.dto.response.IngredientResponse;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * BẢNG NGUYÊN LIỆU
 */

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
@Table(name = "ingredients")
public class Ingredient extends BaseModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long unitId;

    private String name;

    public static Ingredient of(IngredientRequest request) {
        return Ingredient.builder()
                .name(request.getName())
                .unitId(request.getUnitId())
                .build();
    }

    public static IngredientResponse toResponse(Ingredient ingredient) {
        return IngredientResponse.builder()
                .id(ingredient.getId())
                .name(ingredient.getName())
                .unitId(ingredient.getUnitId())
                .build();
    }
}
