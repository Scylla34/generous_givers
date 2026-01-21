package com.generalgivers.foundation.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "app.daraja")
public class MpesaConfig {
    private String consumerKey;
    private String consumerSecret;
    private String shortCode;
    private String passkey;
    private String callbackUrl;
    private String baseUrl;

    /**
     * Get the full OAuth token URL
     */
    public String getOAuthUrl() {
        return baseUrl + "/oauth/v1/generate?grant_type=client_credentials";
    }

    /**
     * Get the STK Push URL
     */
    public String getStkPushUrl() {
        return baseUrl + "/mpesa/stkpush/v1/processrequest";
    }

    /**
     * Get the STK Query URL
     */
    public String getStkQueryUrl() {
        return baseUrl + "/mpesa/stkpushquery/v1/query";
    }
}
