package com.edward.cook_craft.mapper;

import com.edward.cook_craft.dto.request.UnitRequest;
import com.edward.cook_craft.dto.response.UnitResponse;
import com.edward.cook_craft.model.Unit;
import org.springframework.stereotype.Component;

@Component
public class UnitMapper {

    public Unit of(UnitRequest request) {
        return Unit.builder()
                .name(request.getName())
                .build();
    }

    public UnitResponse toResponse(Unit unit) {
        return UnitResponse.builder()
                .id(unit.getId())
                .name(unit.getName())
                .createdAt(unit.getCreatedAt())
                .createdBy(unit.getCreatedBy())
                .modifiedAt(unit.getModifiedAt())
                .modifiedBy(unit.getModifiedBy())
                .status(unit.getStatus())
                .version(unit.getVersion())
                .build();
    }
}
