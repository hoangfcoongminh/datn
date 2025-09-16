package com.edward.cook_craft.service;

import com.edward.cook_craft.dto.request.UnitRequest;
import com.edward.cook_craft.dto.response.UnitResponse;
import com.edward.cook_craft.enums.EntityStatus;
import com.edward.cook_craft.exception.CustomException;
import com.edward.cook_craft.mapper.UnitMapper;
import com.edward.cook_craft.model.Unit;
import com.edward.cook_craft.repository.UnitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UnitService {

    private final UnitRepository repository;
    private final UnitMapper unitMapper;

    public List<UnitResponse> getAll() {
        return repository.findAll().stream()
                .map(unitMapper::toResponse).toList();
    }

    public UnitResponse details(Long id) {
        Optional<Unit> optional = repository.findById(id);
        if (optional.isEmpty()) {
            throw new CustomException("unit.not.found");
        }
        return unitMapper.toResponse(optional.get());
    }

    public Page<UnitResponse> filter(String name, Pageable pageable) {
        String search = name == null ? null : name.trim().toLowerCase();
        Page<Unit> page = repository.filter(search, pageable);
        List<UnitResponse> response = page.getContent().stream().map(unitMapper::toResponse).toList();

        return new PageImpl<>(response, pageable, page.getTotalElements());
    }

    @Transactional
    public UnitResponse create(UnitRequest request) {
        if (repository.existsByName(request.getName())) {
            throw new CustomException("unit.already.exists");
        }
        Unit unit = unitMapper.of(request);
        unit.setId(null);
        return unitMapper.toResponse(repository.save(unit));
    }

    @Transactional
    public UnitResponse update(UnitRequest request) {
        Optional<Unit> optional = repository.findById(request.getId());
        if (optional.isEmpty()) {
            throw new CustomException("unit.not.found");
        }
        Unit unit = optional.get();
        if (!unit.getName().equals(request.getName()) && EntityStatus.ACTIVE.getStatus().equals(request.getStatus()) && repository.existsByName(request.getName())) {
            throw new CustomException("unit.already.exists");
        }
        unit.setName(request.getName());
        unit.setStatus(request.getStatus() == null ? unit.getStatus() : request.getStatus());
        return unitMapper.toResponse(repository.save(unit));
    }
}
