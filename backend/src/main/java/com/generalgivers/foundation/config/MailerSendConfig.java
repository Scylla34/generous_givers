package com.generalgivers.foundation.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "app.mailersend")
public class MailerSendConfig {
    private String apiKey;
    private String fromEmail;
}