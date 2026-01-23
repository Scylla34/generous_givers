package com.generalgivers.foundation.service;

import com.generalgivers.foundation.config.MailerSendConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailerSendService {

    private final MailerSendConfig mailerSendConfig;
    private final WebClient webClient = WebClient.builder().build();

    public void sendEmail(String to, String subject, String htmlContent) {
        try {
            // Debug logging
            log.info("Attempting to send email via MailerSend");
            log.info("API Key configured: {}", mailerSendConfig.getApiKey() != null && !mailerSendConfig.getApiKey().isEmpty());
            log.info("From Email: {}", mailerSendConfig.getFromEmail());
            log.info("To Email: {}", to);
            
            String url = "https://api.mailersend.com/v1/email";
            
            Map<String, Object> emailData = Map.of(
                "from", Map.of(
                    "email", mailerSendConfig.getFromEmail(),
                    "name", "General Givers Foundation"
                ),
                "to", new Object[]{Map.of(
                    "email", to,
                    "name", "User"
                )},
                "subject", subject,
                "html", htmlContent
            );

            log.info("Sending request to MailerSend API: {}", url);
            
            String response = webClient.post()
                    .uri(url)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + mailerSendConfig.getApiKey())
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(emailData)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            log.info("Email sent successfully via MailerSend to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send email via MailerSend to {}: {}", to, e.getMessage());
            log.error("Full error: ", e);
            throw new RuntimeException("Failed to send email", e);
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