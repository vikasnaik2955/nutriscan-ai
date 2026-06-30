package com.nutriscan.security;

import com.nutriscan.domain.Role;
import com.nutriscan.domain.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;

/** Issues and verifies HS256 JWTs. Subject = email; carries {@code uid} and {@code role} claims. */
@Service
public class JwtService {

    private final SecretKey key;
    private final long expirationMinutes;

    public JwtService(JwtProperties props) {
        byte[] secret = props.secret().getBytes(StandardCharsets.UTF_8);
        if (secret.length < 32) {
            throw new IllegalStateException(
                    "nutriscan.security.jwt.secret must be at least 32 bytes for HS256 (set JWT_SECRET).");
        }
        this.key = Keys.hmacShaKeyFor(secret);
        this.expirationMinutes = props.expirationMinutes();
    }

    public String generate(User user) {
        Instant now = Instant.now();
        Instant expiry = now.plus(Duration.ofMinutes(expirationMinutes));
        return Jwts.builder()
                .subject(user.getEmail())
                .claim("uid", user.getId())
                .claim("role", user.getRole().name())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(key)
                .compact();
    }

    /** Verify signature + expiry and decode. Returns empty for any invalid/expired/tampered token. */
    public Optional<JwtPayload> parse(String token) {
        try {
            Claims claims = Jwts.parser().verifyWith(key).build()
                    .parseSignedClaims(token)
                    .getPayload();

            Number uid = claims.get("uid", Number.class);
            String roleName = claims.get("role", String.class);
            if (uid == null || roleName == null) return Optional.empty();

            return Optional.of(new JwtPayload(uid.longValue(), claims.getSubject(), Role.valueOf(roleName)));
        } catch (JwtException | IllegalArgumentException e) {
            // Malformed, expired, bad signature, or unknown role enum -> treat as unauthenticated.
            return Optional.empty();
        }
    }
}
