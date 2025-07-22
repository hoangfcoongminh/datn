package com.edward.cook_craft.dto.response;

import lombok.Getter;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
public class UnitResponse extends BaseResponse {

    private Long id;
    private String name;
}
