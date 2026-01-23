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
            String url = "https://api.mailersend.com/v1/email";
            
            Map<String, Object> emailData = Map.of(
                "from", Map.of("email", mailerSendConfig.getFromEmail()),
                "to", new Object[]{Map.of("email", to)},
                "subject", subject,
                "html", htmlContent
            );

            webClient.post()
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
            throw new RuntimeException("Failed to send email", e);
        }
    }
}