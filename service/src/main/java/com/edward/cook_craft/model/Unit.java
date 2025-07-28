package com.edward.cook_craft.model;

import com.edward.cook_craft.dto.request.UnitRequest;
import com.edward.cook_craft.dto.response.UnitResponse;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * BẢNG ĐƠN VỊ
 */

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Table(name = "units")
public class Unit extends BaseModel {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    private String name;

    public static Unit of(UnitRequest request) {
        return Unit.builder()
                .name(request.getName())
                .build();
    }

    public static UnitResponse toResponse(Unit unit) {
        return UnitResponse.builder()
                .id(unit.getId())
                .name(unit.getName())
                .build();
    }
}
