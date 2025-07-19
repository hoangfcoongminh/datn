package com.edward.cook_craft.service;

import com.edward.cook_craft.dto.request.UnitRequest;
import com.edward.cook_craft.dto.response.UnitResponse;
import com.edward.cook_craft.model.Unit;
import com.edward.cook_craft.repository.UnitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UnitService {

    private final UnitRepository repository;

    public List<UnitResponse> getAll() {
        return repository.findAll().stream()
                .map(Unit::toResponse).toList();
    }

    public UnitResponse create(UnitRequest request) {
        return Unit.toResponse(repository.save(Unit.of(request)));
    }
}
