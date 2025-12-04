package com.generalgivers.foundation.service;

import com.generalgivers.foundation.dto.visit.VisitRequest;
import com.generalgivers.foundation.dto.visit.VisitResponse;
import com.generalgivers.foundation.entity.ChildrenHome;
import com.generalgivers.foundation.entity.User;
import com.generalgivers.foundation.entity.Visit;
import com.generalgivers.foundation.exception.ResourceNotFoundException;
import com.generalgivers.foundation.repository.ChildrenHomeRepository;
import com.generalgivers.foundation.repository.UserRepository;
import com.generalgivers.foundation.repository.VisitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VisitService {

    private final VisitRepository visitRepository;
    private final UserRepository userRepository;
    private final ChildrenHomeRepository childrenHomeRepository;

    public List<VisitResponse> getAllVisits() {
        return visitRepository.findAllOrderByVisitDateDesc().stream()
                .map(this::mapToVisitResponse)
                .collect(Collectors.toList());
    }

    public VisitResponse getVisitById(UUID id) {
        Visit visit = visitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Visit", "id", id));
        return mapToVisitResponse(visit);
    }

    public List<VisitResponse> getVisitsByDateRange(LocalDate startDate, LocalDate endDate) {
        return visitRepository.findByVisitDateBetween(startDate, endDate).stream()
                .map(this::mapToVisitResponse)
                .collect(Collectors.toList());
    }

    public List<VisitResponse> getVisitsByChildrenHome(UUID childrenHomeId) {
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
                .childrenHome(childrenHome)
                .notes(request.getNotes())
                .participants(request.getParticipants())
                .createdBy(creator)
                .photos(request.getPhotos())
                .build();

        visit = visitRepository.save(visit);
        return mapToVisitResponse(visit);
    }

    @Transactional
    public VisitResponse updateVisit(UUID id, VisitRequest request) {
        Visit visit = visitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Visit", "id", id));

        if (request.getVisitDate() != null) {
            visit.setVisitDate(request.getVisitDate());
        }
        if (request.getLocation() != null) {
            visit.setLocation(request.getLocation());
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
        return mapToVisitResponse(visit);
    }

    @Transactional
    public void deleteVisit(UUID id) {
        if (!visitRepository.existsById(id)) {
            throw new ResourceNotFoundException("Visit", "id", id);
        }
        visitRepository.deleteById(id);
    }

    private VisitResponse mapToVisitResponse(Visit visit) {
        return VisitResponse.builder()
                .id(visit.getId())
                .visitDate(visit.getVisitDate())
                .location(visit.getLocation())
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
