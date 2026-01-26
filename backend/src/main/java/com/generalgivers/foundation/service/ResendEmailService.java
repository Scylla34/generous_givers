package com.generalgivers.foundation.service;

import com.generalgivers.foundation.config.ResendConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResendEmailService {

    private final ResendConfig resendConfig;
    private final WebClient webClient = WebClient.builder().build();

    private static final String RESEND_API_URL = "https://api.resend.com/emails";

    public boolean sendEmail(String to, String subject, String htmlContent) {
        try {
            log.info("Attempting to send email via Resend");
            log.info("From Email: {}", resendConfig.getFromEmail());
            log.info("To Email: {}", to);

            Map<String, Object> emailData = new HashMap<>();
            emailData.put("from", "Generous Givers Family <" + resendConfig.getFromEmail() + ">");
            emailData.put("to", List.of(to));
            emailData.put("subject", subject);
            emailData.put("html", htmlContent);

            String response = webClient.post()
                    .uri(RESEND_API_URL)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + resendConfig.getApiKey())
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(emailData)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(java.time.Duration.ofSeconds(30))
                    .block();

            log.info("Email sent successfully via Resend to: {}. Response: {}", to, response);
            return true;
        } catch (WebClientResponseException e) {
            log.error("Resend API error - Status: {}, Body: {}", e.getStatusCode(), e.getResponseBodyAsString());
            return false;
        } catch (Exception e) {
            log.error("Failed to send email via Resend to {}: {}", to, e.getMessage());
            return false;
        }
    }

    public void sendNotificationEmail(String to, String name, String subject, String content) {
        String htmlContent = String.format(
            "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>" +
            "<div style='background: linear-gradient(135deg, #2563eb 0%%, #1d4ed8 100%%); padding: 30px; text-align: center;'>" +
            "<h1 style='color: white; margin: 0; font-size: 28px;'>General Givers Foundation</h1>" +
            "</div>" +
            "<div style='padding: 30px; background-color: #f8fafc;'>" +
            "<h2 style='color: #1e293b; margin-bottom: 20px;'>Hello %s,</h2>" +
            "<p style='color: #475569; line-height: 1.6; margin-bottom: 20px;'>%s</p>" +
            "<div style='text-align: center; margin: 30px 0;'>" +
            "<a href='https://generalgivers.org/dashboard' style='background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;'>View Dashboard</a>" +
            "</div>" +
            "<p style='color: #64748b; font-size: 14px; margin-top: 30px;'>" +
            "Best regards,<br>General Givers Foundation Team" +
            "</p>" +
            "</div>" +
            "</div>",
            name, content
        );
        sendEmail(to, subject, htmlContent);
    }
}
