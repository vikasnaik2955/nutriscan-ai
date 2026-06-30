package com.nutriscan.security;

import com.nutriscan.domain.Role;
import com.nutriscan.domain.User;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtServiceTest {

    private static final String SECRET = "test-secret-test-secret-test-secret-0123456789";
    private final JwtService jwtService = new JwtService(new JwtProperties(SECRET, 60));

    private User sampleUser() {
        User u = new User();
        u.setId(42L);
        u.setEmail("alice@example.com");
        u.setRole(Role.ADMIN);
        u.setPasswordHash("irrelevant");
        u.setEnabled(true);
        return u;
    }

    @Test
    void generatesAndParsesRoundTrip() {
        String token = jwtService.generate(sampleUser());

        Optional<JwtPayload> payload = jwtService.parse(token);

        assertThat(payload).isPresent();
        assertThat(payload.get().userId()).isEqualTo(42L);
        assertThat(payload.get().email()).isEqualTo("alice@example.com");
        assertThat(payload.get().role()).isEqualTo(Role.ADMIN);
    }

    @Test
    void rejectsTamperedToken() {
        String token = jwtService.generate(sampleUser());
        assertThat(jwtService.parse(token + "tampered")).isEmpty();
    }

    @Test
    void rejectsGarbageToken() {
        assertThat(jwtService.parse("not-a-real-jwt")).isEmpty();
    }

    @Test
    void rejectsTokenSignedWithDifferentKey() {
        JwtService other = new JwtService(new JwtProperties("another-secret-another-secret-9876543210", 60));
        String foreignToken = other.generate(sampleUser());
        assertThat(jwtService.parse(foreignToken)).isEmpty();
    }

    @Test
    void rejectsTooShortSecret() {
        assertThatThrownBy(() -> new JwtService(new JwtProperties("too-short", 60)))
                .isInstanceOf(IllegalStateException.class);
    }
}
