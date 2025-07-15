package com.edward.pharmacy.enums;

public enum EntityStatus {
    ACTIVE(1L),
    IN_ACTIVE(0L);

    private final Long status;

    EntityStatus(Long status) {
        this.status = status;
    }

    public Long getStatus() {
        return status;
    }
}
