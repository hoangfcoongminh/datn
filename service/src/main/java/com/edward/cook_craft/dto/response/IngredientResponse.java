package com.edward.cook_craft.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class IngredientResponse {

    private Long id;
    private Long unitId;
    private String name;

}
