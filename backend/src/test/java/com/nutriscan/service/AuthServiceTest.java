package com.nutriscan.service;

import com.nutriscan.common.error.ApiException;
import com.nutriscan.common.error.ConflictException;
import com.nutriscan.domain.Role;
import com.nutriscan.domain.User;
import com.nutriscan.dto.AuthResponse;
import com.nutriscan.dto.LoginRequest;
import com.nutriscan.dto.RegisterRequest;
import com.nutriscan.repository.UserRepository;
import com.nutriscan.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;
    @InjectMocks
    private AuthService authService;

    private User existingUser() {
        User u = new User();
        u.setId(1L);
        u.setEmail("user@example.com");
        u.setPasswordHash("HASH");
        u.setDisplayName("Test User");
        u.setRole(Role.USER);
        u.setEnabled(true);
        return u;
    }

    @Test
    void registerCreatesUserAndReturnsToken() {
        when(userRepository.existsByEmailIgnoreCase("user@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password1")).thenReturn("HASH");
        when(jwtService.generate(any(User.class))).thenReturn("TOKEN");

        AuthResponse res = authService.register(new RegisterRequest("user@example.com", "password1", "Test User"));

        assertThat(res.token()).isEqualTo("TOKEN");
        assertThat(res.user().email()).isEqualTo("user@example.com");
        assertThat(res.user().role()).isEqualTo("USER");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void registerNormalizesEmailToLowercase() {
        when(userRepository.existsByEmailIgnoreCase("user@example.com")).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("HASH");
        when(jwtService.generate(any(User.class))).thenReturn("TOKEN");

        AuthResponse res = authService.register(new RegisterRequest("  USER@Example.com ", "password1", "Test User"));

        assertThat(res.user().email()).isEqualTo("user@example.com");
    }

    @Test
    void registerRejectsDuplicateEmail() {
        when(userRepository.existsByEmailIgnoreCase("user@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(new RegisterRequest("user@example.com", "password1", "Test User")))
                .isInstanceOf(ConflictException.class);

        verify(userRepository, never()).save(any());
    }

    @Test
    void loginSucceedsWithCorrectPassword() {
        when(userRepository.findByEmailIgnoreCase("user@example.com")).thenReturn(Optional.of(existingUser()));
        when(passwordEncoder.matches("password1", "HASH")).thenReturn(true);
        when(jwtService.generate(any(User.class))).thenReturn("TOKEN");

        AuthResponse res = authService.login(new LoginRequest("user@example.com", "password1"));

        assertThat(res.token()).isEqualTo("TOKEN");
        assertThat(res.user().id()).isEqualTo(1L);
    }

    @Test
    void loginRejectsWrongPassword() {
        when(userRepository.findByEmailIgnoreCase("user@example.com")).thenReturn(Optional.of(existingUser()));
        when(passwordEncoder.matches("wrong", "HASH")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(new LoginRequest("user@example.com", "wrong")))
                .isInstanceOfSatisfying(ApiException.class,
                        ex -> assertThat(ex.getStatus()).isEqualTo(HttpStatus.UNAUTHORIZED));
    }

    @Test
    void loginRejectsUnknownEmail() {
        when(userRepository.findByEmailIgnoreCase("ghost@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(new LoginRequest("ghost@example.com", "password1")))
                .isInstanceOfSatisfying(ApiException.class,
                        ex -> assertThat(ex.getStatus()).isEqualTo(HttpStatus.UNAUTHORIZED));
    }

    @Test
    void loginRejectsDisabledAccount() {
        User disabled = existingUser();
        disabled.setEnabled(false);
        when(userRepository.findByEmailIgnoreCase("user@example.com")).thenReturn(Optional.of(disabled));
        when(passwordEncoder.matches("password1", "HASH")).thenReturn(true);

        assertThatThrownBy(() -> authService.login(new LoginRequest("user@example.com", "password1")))
                .isInstanceOfSatisfying(ApiException.class,
                        ex -> assertThat(ex.getStatus()).isEqualTo(HttpStatus.FORBIDDEN));
    }
}
