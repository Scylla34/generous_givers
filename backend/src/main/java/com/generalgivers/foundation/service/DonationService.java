package com.generalgivers.foundation.service;

import com.generalgivers.foundation.dto.donation.DonationRequest;
import com.generalgivers.foundation.dto.donation.DonationResponse;
import com.generalgivers.foundation.entity.*;
import com.generalgivers.foundation.exception.ResourceNotFoundException;
import com.generalgivers.foundation.repository.DonationRepository;
import com.generalgivers.foundation.repository.ProjectRepository;
import com.generalgivers.foundation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DonationService {

    private final DonationRepository donationRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final DonationNotificationService donationNotificationService;
    private final NotificationService notificationService;

    public List<DonationResponse> getAllDonations() {
        return donationRepository.findAllOrderByDateDesc().stream()
                .map(this::mapToDonationResponse)
                .collect(Collectors.toList());
    }

    public DonationResponse getDonationById(UUID id) {
        Donation donation = donationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation", "id", id));
        return mapToDonationResponse(donation);
    }

    public List<DonationResponse> getDonationsByUser(UUID userId) {
        return donationRepository.findByDonorUserId(userId).stream()
                .map(this::mapToDonationResponse)
                .collect(Collectors.toList());
    }

    public List<DonationResponse> getDonationsByProject(UUID projectId) {
        return donationRepository.findByProjectId(projectId).stream()
                .map(this::mapToDonationResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public DonationResponse createDonation(DonationRequest request, String userEmail) {
        User donorUser = null;
        if (userEmail != null) {
            donorUser = userRepository.findByEmail(userEmail).orElse(null);
        }

        Project project = null;
        if (request.getProjectId() != null) {
            project = projectRepository.findById(request.getProjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Project", "id", request.getProjectId()));
        }

        Donation donation = Donation.builder()
                .donorUser(donorUser)
                .donorName(request.getDonorName())
                .email(request.getEmail())
                .amount(request.getAmount())
                .date(LocalDateTime.now())
                .method(request.getMethod())
                .status(DonationStatus.COMPLETED)
                .project(project)
                .build();

        donation = donationRepository.save(donation);

        // Update project funds if applicable
        if (project != null) {
            project.setFundsRaised(project.getFundsRaised().add(request.getAmount()));
            projectRepository.save(project);
        }

        // Email notifications disabled for donations
        // donationNotificationService.notifyDonationReceived(
        //     request.getDonorName(),
        //     request.getAmount(),
        //     project != null ? project.getTitle() : null
        // );

        // Send in-app notification
        notificationService.createNotification(
            "New Donation Received",
            String.format("%s donated KES %,.2f%s",
                    request.getDonorName(),
                    request.getAmount(),
                    project != null ? " to " + project.getTitle() : ""),
            NotificationType.DONATION_RECEIVED,
            "DONATION",
            donation.getId(),
            null,
            null,
            true
        );

        return mapToDonationResponse(donation);
    }

    public BigDecimal getTotalDonations() {
        BigDecimal total = donationRepository.getTotalDonationAmount();
        return total != null ? total : BigDecimal.ZERO;
    }

    public BigDecimal getTotalDonationsByProject(UUID projectId) {
        BigDecimal total = donationRepository.getTotalDonationsByProject(projectId);
        return total != null ? total : BigDecimal.ZERO;
    }

    private DonationResponse mapToDonationResponse(Donation donation) {
        return DonationResponse.builder()
                .id(donation.getId())
                .donorUserId(donation.getDonorUser() != null ? donation.getDonorUser().getId() : null)
                .donorName(donation.getDonorName())
                .email(donation.getEmail())
                .amount(donation.getAmount())
                .date(donation.getDate())
                .method(donation.getMethod())
                .status(donation.getStatus())
                .projectId(donation.getProject() != null ? donation.getProject().getId() : null)
                .projectTitle(donation.getProject() != null ? donation.getProject().getTitle() : null)
                .createdAt(donation.getCreatedAt())
                .build();
    }
}
