package com.generalgivers.foundation.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Value("${app.cors.allowed-origins:http://localhost:3000,https://generousgiversfamily.netlify.app}")
    private String allowedOrigins;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Parse allowed origins
        List<String> origins = new ArrayList<>();
        if (allowedOrigins != null && !allowedOrigins.trim().isEmpty()) {
            if ("*".equals(allowedOrigins.trim())) {
                // For development: allow all origins without credentials
                configuration.setAllowedOriginPatterns(List.of("*"));
                configuration.setAllowCredentials(false);
            } else {
                // For production: parse comma-separated origins
                String[] originArray = allowedOrigins.split(",");
                for (String origin : originArray) {
                    String trimmedOrigin = origin.trim();
                    if (!trimmedOrigin.isEmpty()) {
                        origins.add(trimmedOrigin);
                    }
                }
                configuration.setAllowedOrigins(origins);
                configuration.setAllowCredentials(true);
            }
        } else {
            // Fallback to localhost for development
            configuration.setAllowedOrigins(Arrays.asList(
                    "http://localhost:3000",
                    "http://localhost:3001",
                    "https://generousgiversfamily.netlify.app",
                    "https://generous-givers.vercel.app"
            ));
            configuration.setAllowCredentials(true);
        }
        
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type", "Set-Cookie"));
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
