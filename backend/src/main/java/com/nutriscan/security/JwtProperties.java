package com.nutriscan.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Binds {@code nutriscan.security.jwt.*} from application.yml.
 * {@code secret} must be at least 32 bytes for HS256 (validated in {@link JwtService}).
 */
@ConfigurationProperties(prefix = "nutriscan.security.jwt")
public record JwtProperties(String secret, long expirationMinutes) {
}
