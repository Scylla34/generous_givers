package com.generalgivers.foundation.service;

import com.generalgivers.foundation.config.MpesaConfig;
import com.generalgivers.foundation.dto.mpesa.*;
import com.generalgivers.foundation.entity.Donation;
import com.generalgivers.foundation.entity.DonationStatus;
import com.generalgivers.foundation.entity.Project;
import com.generalgivers.foundation.repository.DonationRepository;
import com.generalgivers.foundation.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MpesaService {

    private final MpesaConfig mpesaConfig;
    private final DonationRepository donationRepository;
    private final ProjectRepository projectRepository;
    private final RestTemplate restTemplate;
    private final NotificationService notificationService;

    private static final DateTimeFormatter TIMESTAMP_FORMAT = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    /**
     * Get OAuth access token from Safaricom
     */
    public String getAccessToken() {
        String credentials = mpesaConfig.getConsumerKey() + ":" + mpesaConfig.getConsumerSecret();
        String encodedCredentials = Base64.getEncoder().encodeToString(credentials.getBytes(StandardCharsets.UTF_8));

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Basic " + encodedCredentials);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> request = new HttpEntity<>(headers);

        try {
            ResponseEntity<MpesaAuthResponse> response = restTemplate.exchange(
                    mpesaConfig.getOAuthUrl(),
                    HttpMethod.GET,
                    request,
                    MpesaAuthResponse.class
            );

            if (response.getBody() != null) {
                log.info("M-Pesa OAuth token obtained successfully");
                return response.getBody().getAccessToken();
            }
        } catch (Exception e) {
            log.error("Failed to get M-Pesa OAuth token: {}", e.getMessage());
            throw new RuntimeException("Failed to authenticate with M-Pesa", e);
        }

        throw new RuntimeException("Failed to get M-Pesa access token");
    }

    /**
     * Generate password for STK Push
     */
    private String generatePassword(String timestamp) {
        String rawPassword = mpesaConfig.getShortCode() + mpesaConfig.getPasskey() + timestamp;
        return Base64.getEncoder().encodeToString(rawPassword.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Initiate STK Push payment
     */
    @Transactional
    public StkPushResponse initiatePayment(MpesaPaymentRequest paymentRequest) {
        String timestamp = LocalDateTime.now().format(TIMESTAMP_FORMAT);
        String password = generatePassword(timestamp);
        String accessToken = getAccessToken();

        // Create pending donation record
        Donation donation = createPendingDonation(paymentRequest);

        // Build STK Push request
        String accountRef = paymentRequest.getAccountReference() != null
                ? paymentRequest.getAccountReference()
                : "GGF-" + donation.getId().toString().substring(0, 8).toUpperCase();

        StkPushRequest stkRequest = StkPushRequest.builder()
                .businessShortCode(mpesaConfig.getShortCode())
                .password(password)
                .timestamp(timestamp)
                .transactionType("CustomerPayBillOnline")
                .amount(paymentRequest.getAmount().setScale(0).toString())
                .partyA(paymentRequest.getNormalizedPhoneNumber())
                .partyB(mpesaConfig.getShortCode())
                .phoneNumber(paymentRequest.getNormalizedPhoneNumber())
                .callBackURL(mpesaConfig.getCallbackUrl())
                .accountReference(accountRef)
                .transactionDesc("Donation to Generous Givers Family")
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<StkPushRequest> request = new HttpEntity<>(stkRequest, headers);

        try {
            ResponseEntity<StkPushResponse> response = restTemplate.exchange(
                    mpesaConfig.getStkPushUrl(),
                    HttpMethod.POST,
                    request,
                    StkPushResponse.class
            );

            StkPushResponse stkResponse = response.getBody();
            if (stkResponse != null) {
                // Update donation with M-Pesa request IDs
                donation.setMerchantRequestId(stkResponse.getMerchantRequestId());
                donation.setCheckoutRequestId(stkResponse.getCheckoutRequestId());
                donationRepository.save(donation);

                log.info("STK Push initiated successfully. CheckoutRequestID: {}", stkResponse.getCheckoutRequestId());
                return stkResponse;
            }
        } catch (Exception e) {
            log.error("STK Push failed: {}", e.getMessage());
            // Mark donation as failed
            donation.setStatus(DonationStatus.FAILED);
            donation.setResultDesc("STK Push initiation failed: " + e.getMessage());
            donationRepository.save(donation);
            throw new RuntimeException("Failed to initiate M-Pesa payment", e);
        }

        throw new RuntimeException("Failed to initiate STK Push");
    }

    /**
     * Create a pending donation record
     */
    private Donation createPendingDonation(MpesaPaymentRequest request) {
        Donation donation = Donation.builder()
                .donorName(request.getDonorName())
                .email(request.getEmail())
                .phoneNumber(request.getNormalizedPhoneNumber())
                .amount(request.getAmount())
                .date(LocalDateTime.now())
                .method("M-PESA")
                .status(DonationStatus.PENDING)
                .build();

        if (request.getProjectId() != null) {
            projectRepository.findById(request.getProjectId())
                    .ifPresent(donation::setProject);
        }

        return donationRepository.save(donation);
    }

    /**
     * Process M-Pesa callback
     */
    @Transactional
    public void processCallback(StkCallback callback) {
        StkCallback.StkCallbackContent content = callback.getBody().getStkCallback();

        log.info("Processing M-Pesa callback. CheckoutRequestID: {}, ResultCode: {}",
                content.getCheckoutRequestId(), content.getResultCode());

        // Find the donation by checkout request ID
        Optional<Donation> donationOpt = donationRepository.findByCheckoutRequestId(content.getCheckoutRequestId());

        if (donationOpt.isEmpty()) {
            log.warn("No donation found for CheckoutRequestID: {}", content.getCheckoutRequestId());
            return;
        }

        Donation donation = donationOpt.get();
        donation.setResultCode(content.getResultCode());
        donation.setResultDesc(content.getResultDesc());

        if (content.isSuccessful()) {
            // Payment successful
            StkCallback.CallbackMetadata metadata = content.getCallbackMetadata();
            if (metadata != null) {
                donation.setMpesaReceiptNumber(metadata.getValueByName("MpesaReceiptNumber"));

                String transactionDateStr = metadata.getValueByName("TransactionDate");
                if (transactionDateStr != null) {
                    try {
                        donation.setTransactionDate(
                                LocalDateTime.parse(transactionDateStr, TIMESTAMP_FORMAT)
                        );
                    } catch (Exception e) {
                        log.warn("Failed to parse transaction date: {}", transactionDateStr);
                    }
                }

                // Verify amount matches
                String paidAmount = metadata.getValueByName("Amount");
                if (paidAmount != null) {
                    BigDecimal paid = new BigDecimal(paidAmount);
                    if (paid.compareTo(donation.getAmount()) != 0) {
                        log.warn("Amount mismatch. Expected: {}, Received: {}",
                                donation.getAmount(), paid);
                    }
                }
            }

            donation.setStatus(DonationStatus.COMPLETED);

            // Update project funds if linked to a project
            if (donation.getProject() != null) {
                Project project = donation.getProject();
                BigDecimal newFundsRaised = project.getFundsRaised().add(donation.getAmount());
                project.setFundsRaised(newFundsRaised);
                projectRepository.save(project);
                log.info("Updated project {} funds to {}", project.getId(), newFundsRaised);
            }

            log.info("Donation {} completed successfully. Receipt: {}",
                    donation.getId(), donation.getMpesaReceiptNumber());

            // Send notification for successful donation
            notificationService.notifyDonationCompleted(
                    donation.getDonorName(),
                    donation.getAmount(),
                    donation.getMpesaReceiptNumber(),
                    donation.getId()
            );
        } else {
            // Payment failed
            donation.setStatus(DonationStatus.FAILED);
            log.info("Donation {} failed. Reason: {}", donation.getId(), content.getResultDesc());

            // Send notification for failed donation
            notificationService.notifyDonationFailed(
                    donation.getDonorName(),
                    donation.getAmount(),
                    content.getResultDesc()
            );
        }

        donationRepository.save(donation);
    }

    /**
     * Query STK Push transaction status
     */
    public String queryTransactionStatus(String checkoutRequestId) {
        String timestamp = LocalDateTime.now().format(TIMESTAMP_FORMAT);
        String password = generatePassword(timestamp);
        String accessToken = getAccessToken();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        String requestBody = String.format(
                "{\"BusinessShortCode\":\"%s\",\"Password\":\"%s\",\"Timestamp\":\"%s\",\"CheckoutRequestID\":\"%s\"}",
                mpesaConfig.getShortCode(), password, timestamp, checkoutRequestId
        );

        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    mpesaConfig.getStkQueryUrl(),
                    HttpMethod.POST,
                    request,
                    String.class
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Failed to query transaction status: {}", e.getMessage());
            throw new RuntimeException("Failed to query transaction status", e);
        }
    }

    /**
     * Get donation by checkout request ID
     */
    public Optional<Donation> getDonationByCheckoutRequestId(String checkoutRequestId) {
        return donationRepository.findByCheckoutRequestId(checkoutRequestId);
    }
}
