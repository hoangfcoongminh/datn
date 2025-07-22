package com.edward.cook_craft.enums;

public enum EntityStatus {
    ACTIVE(1),
    IN_ACTIVE(0);

    private final Integer status;

    EntityStatus(Integer status) {
        this.status = status;
    }

    public Integer getStatus() {
        return status;
    }
}
