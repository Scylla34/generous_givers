package com.generalgivers.foundation.controller;

import com.generalgivers.foundation.dto.mpesa.MpesaPaymentRequest;
import com.generalgivers.foundation.dto.mpesa.StkCallback;
import com.generalgivers.foundation.dto.mpesa.StkPushResponse;
import com.generalgivers.foundation.entity.Donation;
import com.generalgivers.foundation.service.MpesaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/mpesa")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "M-Pesa", description = "M-Pesa Daraja API integration endpoints")
public class MpesaController {

    private final MpesaService mpesaService;

    @PostMapping("/stkpush")
    @Operation(summary = "Initiate STK Push", description = "Sends STK Push prompt to customer's phone for payment")
    public ResponseEntity<Map<String, Object>> initiateStkPush(@Valid @RequestBody MpesaPaymentRequest request) {
        log.info("Initiating STK Push for phone: {}, amount: {}",
                request.getPhoneNumber(), request.getAmount());

        try {
            StkPushResponse response = mpesaService.initiatePayment(request);

            Map<String, Object> result = new HashMap<>();
            result.put("success", response.isSuccessful());
            result.put("merchantRequestId", response.getMerchantRequestId());
            result.put("checkoutRequestId", response.getCheckoutRequestId());
            result.put("responseCode", response.getResponseCode());
            result.put("responseDescription", response.getResponseDescription());
            result.put("customerMessage", response.getCustomerMessage());

            if (response.isSuccessful()) {
                return ResponseEntity.ok(result);
            } else {
                result.put("errorMessage", response.getErrorMessage());
                return ResponseEntity.badRequest().body(result);
            }
        } catch (Exception e) {
            log.error("STK Push initiation failed: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("errorMessage", e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @PostMapping("/callback")
    @Operation(summary = "M-Pesa Callback", description = "Callback endpoint for M-Pesa payment notifications")
    public ResponseEntity<Map<String, String>> handleCallback(@RequestBody StkCallback callback) {
        log.info("Received M-Pesa callback: {}", callback);

        try {
            mpesaService.processCallback(callback);

            Map<String, String> response = new HashMap<>();
            response.put("ResultCode", "0");
            response.put("ResultDesc", "Callback processed successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to process M-Pesa callback: {}", e.getMessage());
            Map<String, String> response = new HashMap<>();
            response.put("ResultCode", "1");
            response.put("ResultDesc", "Failed to process callback");
            return ResponseEntity.ok(response); // Always return 200 to M-Pesa
        }
    }

    @GetMapping("/status/{checkoutRequestId}")
    @Operation(summary = "Check Payment Status", description = "Query the status of a pending payment")
    public ResponseEntity<Map<String, Object>> checkPaymentStatus(@PathVariable String checkoutRequestId) {
        log.info("Checking payment status for: {}", checkoutRequestId);

        Map<String, Object> result = new HashMap<>();

        // First check our database
        Optional<Donation> donationOpt = mpesaService.getDonationByCheckoutRequestId(checkoutRequestId);

        if (donationOpt.isPresent()) {
            Donation donation = donationOpt.get();
            result.put("found", true);
            result.put("status", donation.getStatus().name());
            result.put("amount", donation.getAmount());
            result.put("phoneNumber", donation.getPhoneNumber());
            result.put("mpesaReceiptNumber", donation.getMpesaReceiptNumber());
            result.put("resultDesc", donation.getResultDesc());

            if (donation.getProject() != null) {
                result.put("projectId", donation.getProject().getId());
                result.put("projectTitle", donation.getProject().getTitle());
            }

            return ResponseEntity.ok(result);
        }

        result.put("found", false);
        result.put("message", "Payment not found");
        return ResponseEntity.ok(result);
    }

    @PostMapping("/query")
    @Operation(summary = "Query Transaction", description = "Query M-Pesa for transaction status")
    public ResponseEntity<String> queryTransaction(@RequestBody Map<String, String> request) {
        String checkoutRequestId = request.get("checkoutRequestId");

        if (checkoutRequestId == null || checkoutRequestId.isEmpty()) {
            return ResponseEntity.badRequest().body("checkoutRequestId is required");
        }

        try {
            String response = mpesaService.queryTransactionStatus(checkoutRequestId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to query transaction: {}", e.getMessage());
            return ResponseEntity.internalServerError().body("Failed to query transaction: " + e.getMessage());
        }
    }
}
