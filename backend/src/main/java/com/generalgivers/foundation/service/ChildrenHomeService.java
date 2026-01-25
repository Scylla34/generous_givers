package com.generalgivers.foundation.service;

import com.generalgivers.foundation.dto.childrenhome.ChildrenHomeRequest;
import com.generalgivers.foundation.dto.childrenhome.ChildrenHomeResponse;
import com.generalgivers.foundation.entity.ChildrenHome;
import com.generalgivers.foundation.entity.User;
import com.generalgivers.foundation.exception.ResourceNotFoundException;
import com.generalgivers.foundation.repository.ChildrenHomeRepository;
import com.generalgivers.foundation.repository.UserRepository;
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
    private final UserRepository userRepository;
    private final ChildrenHomeNotificationService childrenHomeNotificationService;

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
    public ChildrenHomeResponse createChildrenHome(ChildrenHomeRequest request, String userEmail) {
        User creator = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        ChildrenHome childrenHome = ChildrenHome.builder()
                .name(request.getName())
                .location(request.getLocation())
                .city(request.getCity())
                .town(request.getTown())
                .village(request.getVillage())
                .contact(request.getContact())
                .notes(request.getNotes())
                .build();

        childrenHome = childrenHomeRepository.save(childrenHome);
        
        // Send notifications
        childrenHomeNotificationService.notifyChildrenHomeCreated(childrenHome.getName(), creator.getName());
        
        return mapToChildrenHomeResponse(childrenHome);
    }

    @Transactional
    public ChildrenHomeResponse updateChildrenHome(UUID id, ChildrenHomeRequest request, String userEmail) {
        ChildrenHome childrenHome = childrenHomeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ChildrenHome", "id", id));

        User updater = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        if (request.getName() != null) {
            childrenHome.setName(request.getName());
        }
        if (request.getLocation() != null) {
            childrenHome.setLocation(request.getLocation());
        }
        if (request.getCity() != null) {
            childrenHome.setCity(request.getCity());
        }
        if (request.getTown() != null) {
            childrenHome.setTown(request.getTown());
        }
        if (request.getVillage() != null) {
            childrenHome.setVillage(request.getVillage());
        }
        if (request.getContact() != null) {
            childrenHome.setContact(request.getContact());
        }
        if (request.getNotes() != null) {
            childrenHome.setNotes(request.getNotes());
        }

        childrenHome = childrenHomeRepository.save(childrenHome);
        
        // Send notifications
        childrenHomeNotificationService.notifyChildrenHomeUpdated(childrenHome.getName(), updater.getName());
        
        return mapToChildrenHomeResponse(childrenHome);
    }

    @Transactional
    public void deleteChildrenHome(UUID id, String userEmail) {
        ChildrenHome childrenHome = childrenHomeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ChildrenHome", "id", id));
        
        User deleter = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));
        
        String homeName = childrenHome.getName();
        
        childrenHomeRepository.deleteById(id);
        
        // Send deletion notification
        childrenHomeNotificationService.notifyChildrenHomeDeleted(homeName, deleter.getName());
    }

    private ChildrenHomeResponse mapToChildrenHomeResponse(ChildrenHome childrenHome) {
        return ChildrenHomeResponse.builder()
                .id(childrenHome.getId())
                .name(childrenHome.getName())
                .location(childrenHome.getLocation())
                .city(childrenHome.getCity())
                .town(childrenHome.getTown())
                .village(childrenHome.getVillage())
                .contact(childrenHome.getContact())
                .notes(childrenHome.getNotes())
                .createdAt(childrenHome.getCreatedAt())
                .build();
    }
}
