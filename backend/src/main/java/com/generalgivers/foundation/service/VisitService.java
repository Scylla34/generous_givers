package com.generalgivers.foundation.service;

import com.generalgivers.foundation.dto.visit.VisitRequest;
import com.generalgivers.foundation.dto.visit.VisitResponse;
import com.generalgivers.foundation.entity.ChildrenHome;
import com.generalgivers.foundation.entity.NotificationType;
import com.generalgivers.foundation.entity.User;
import com.generalgivers.foundation.entity.Visit;
import com.generalgivers.foundation.exception.ResourceNotFoundException;
import com.generalgivers.foundation.repository.ChildrenHomeRepository;
import com.generalgivers.foundation.repository.UserRepository;
import com.generalgivers.foundation.repository.VisitRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VisitService {

    private final VisitRepository visitRepository;
    private final UserRepository userRepository;
    private final ChildrenHomeRepository childrenHomeRepository;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public List<VisitResponse> getAllVisits() {
        log.info("Fetching all visits");
        try {
            List<Visit> visits = visitRepository.findAll();
            log.info("Found {} visits", visits.size());
            return visits.stream()
                    .map(this::mapToVisitResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching visits: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Transactional(readOnly = true)
    public VisitResponse getVisitById(UUID id) {
        log.info("Fetching visit by id: {}", id);
        Visit visit = visitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Visit", "id", id));
        return mapToVisitResponse(visit);
    }

    @Transactional(readOnly = true)
    public List<VisitResponse> getVisitsByDateRange(LocalDate startDate, LocalDate endDate) {
        log.info("Fetching visits between {} and {}", startDate, endDate);
        return visitRepository.findByVisitDateBetween(startDate, endDate).stream()
                .map(this::mapToVisitResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VisitResponse> getVisitsByChildrenHome(UUID childrenHomeId) {
        log.info("Fetching visits for children home: {}", childrenHomeId);
        return visitRepository.findByChildrenHomeId(childrenHomeId).stream()
                .map(this::mapToVisitResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public VisitResponse createVisit(VisitRequest request, String userEmail) {
        User creator = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        ChildrenHome childrenHome = null;
        if (request.getChildrenHomeId() != null) {
            childrenHome = childrenHomeRepository.findById(request.getChildrenHomeId())
                    .orElseThrow(() -> new ResourceNotFoundException("ChildrenHome", "id", request.getChildrenHomeId()));
        }

        Visit visit = Visit.builder()
                .visitDate(request.getVisitDate())
                .location(request.getLocation())
                .city(request.getCity())
                .town(request.getTown())
                .village(request.getVillage())
                .childrenHome(childrenHome)
                .notes(request.getNotes())
                .participants(request.getParticipants())
                .createdBy(creator)
                .photos(request.getPhotos())
                .build();

        visit = visitRepository.save(visit);
        
        // Email notifications disabled for visits
        // visitNotificationService.notifyVisitRecorded(location, creator.getName());
        
        // Send in-app notification
        String location = childrenHome != null ? childrenHome.getName() : 
                         (visit.getLocation() != null ? visit.getLocation() : "Unknown Location");
        notificationService.createNotification(
            "Visit Recorded",
            "New visit recorded at " + location + " by " + creator.getName(),
            NotificationType.VISIT_COMPLETED,
            "VISIT",
            visit.getId(),
            null,
            null,
            true
        );
        
        return mapToVisitResponse(visit);
    }

    @Transactional
    public VisitResponse updateVisit(UUID id, VisitRequest request, String userEmail) {
        Visit visit = visitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Visit", "id", id));

        User updater = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        if (request.getVisitDate() != null) {
            visit.setVisitDate(request.getVisitDate());
        }
        if (request.getLocation() != null) {
            visit.setLocation(request.getLocation());
        }
        if (request.getCity() != null) {
            visit.setCity(request.getCity());
        }
        if (request.getTown() != null) {
            visit.setTown(request.getTown());
        }
        if (request.getVillage() != null) {
            visit.setVillage(request.getVillage());
        }
        if (request.getChildrenHomeId() != null) {
            ChildrenHome childrenHome = childrenHomeRepository.findById(request.getChildrenHomeId())
                    .orElseThrow(() -> new ResourceNotFoundException("ChildrenHome", "id", request.getChildrenHomeId()));
            visit.setChildrenHome(childrenHome);
        }
        if (request.getNotes() != null) {
            visit.setNotes(request.getNotes());
        }
        if (request.getParticipants() != null) {
            visit.setParticipants(request.getParticipants());
        }
        if (request.getPhotos() != null) {
            visit.setPhotos(request.getPhotos());
        }

        visit = visitRepository.save(visit);
        
        // Email notifications disabled for visits
        // visitNotificationService.notifyVisitUpdated(location, updater.getName());
        
        // Send in-app notification
        String location = visit.getChildrenHome() != null ? visit.getChildrenHome().getName() : 
                         (visit.getLocation() != null ? visit.getLocation() : "Unknown Location");
        notificationService.createNotification(
            "Visit Updated",
            "Visit at " + location + " updated by " + updater.getName(),
            NotificationType.VISIT_COMPLETED,
            "VISIT",
            visit.getId(),
            null,
            null,
            true
        );
        
        return mapToVisitResponse(visit);
    }

    @Transactional
    public void deleteVisit(UUID id, String userEmail) {
        Visit visit = visitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Visit", "id", id));
        
        User deleter = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));
        
        String location = visit.getChildrenHome() != null ? visit.getChildrenHome().getName() : 
                         (visit.getLocation() != null ? visit.getLocation() : "Unknown Location");
        
        visitRepository.deleteById(id);
        
        // Email notifications disabled for visits
        // visitNotificationService.notifyVisitDeleted(location, deleter.getName());
    }

    private VisitResponse mapToVisitResponse(Visit visit) {
        return VisitResponse.builder()
                .id(visit.getId())
                .visitDate(visit.getVisitDate())
                .location(visit.getLocation())
                .city(visit.getCity())
                .town(visit.getTown())
                .village(visit.getVillage())
                .childrenHomeId(visit.getChildrenHome() != null ? visit.getChildrenHome().getId() : null)
                .childrenHomeName(visit.getChildrenHome() != null ? visit.getChildrenHome().getName() : null)
                .notes(visit.getNotes())
                .participants(visit.getParticipants())
                .createdById(visit.getCreatedBy() != null ? visit.getCreatedBy().getId() : null)
                .createdByName(visit.getCreatedBy() != null ? visit.getCreatedBy().getName() : null)
                .photos(visit.getPhotos())
                .createdAt(visit.getCreatedAt())
                .build();
    }
}
