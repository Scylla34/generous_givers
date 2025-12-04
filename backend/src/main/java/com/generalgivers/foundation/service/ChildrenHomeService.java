package com.generalgivers.foundation.service;

import com.generalgivers.foundation.dto.childrenhome.ChildrenHomeRequest;
import com.generalgivers.foundation.dto.childrenhome.ChildrenHomeResponse;
import com.generalgivers.foundation.entity.ChildrenHome;
import com.generalgivers.foundation.exception.ResourceNotFoundException;
import com.generalgivers.foundation.repository.ChildrenHomeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChildrenHomeService {

    private final ChildrenHomeRepository childrenHomeRepository;

    public List<ChildrenHomeResponse> getAllChildrenHomes() {
        return childrenHomeRepository.findAll().stream()
                .map(this::mapToChildrenHomeResponse)
                .collect(Collectors.toList());
    }

    public ChildrenHomeResponse getChildrenHomeById(UUID id) {
        ChildrenHome childrenHome = childrenHomeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ChildrenHome", "id", id));
        return mapToChildrenHomeResponse(childrenHome);
    }

    @Transactional
    public ChildrenHomeResponse createChildrenHome(ChildrenHomeRequest request) {
        ChildrenHome childrenHome = ChildrenHome.builder()
                .name(request.getName())
                .location(request.getLocation())
                .contact(request.getContact())
                .notes(request.getNotes())
                .build();

        childrenHome = childrenHomeRepository.save(childrenHome);
        return mapToChildrenHomeResponse(childrenHome);
    }

    @Transactional
    public ChildrenHomeResponse updateChildrenHome(UUID id, ChildrenHomeRequest request) {
        ChildrenHome childrenHome = childrenHomeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ChildrenHome", "id", id));

        if (request.getName() != null) {
            childrenHome.setName(request.getName());
        }
        if (request.getLocation() != null) {
            childrenHome.setLocation(request.getLocation());
        }
        if (request.getContact() != null) {
            childrenHome.setContact(request.getContact());
        }
        if (request.getNotes() != null) {
            childrenHome.setNotes(request.getNotes());
        }

        childrenHome = childrenHomeRepository.save(childrenHome);
        return mapToChildrenHomeResponse(childrenHome);
    }

    @Transactional
    public void deleteChildrenHome(UUID id) {
        if (!childrenHomeRepository.existsById(id)) {
            throw new ResourceNotFoundException("ChildrenHome", "id", id);
        }
        childrenHomeRepository.deleteById(id);
    }

    private ChildrenHomeResponse mapToChildrenHomeResponse(ChildrenHome childrenHome) {
        return ChildrenHomeResponse.builder()
                .id(childrenHome.getId())
                .name(childrenHome.getName())
                .location(childrenHome.getLocation())
                .contact(childrenHome.getContact())
                .notes(childrenHome.getNotes())
                .createdAt(childrenHome.getCreatedAt())
                .build();
    }
}
