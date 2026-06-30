package com.nutriscan.service;

import com.nutriscan.common.error.ApiException;
import com.nutriscan.common.error.ConflictException;
import com.nutriscan.common.error.ResourceNotFoundException;
import com.nutriscan.domain.Role;
import com.nutriscan.domain.User;
import com.nutriscan.dto.AuthResponse;
import com.nutriscan.dto.LoginRequest;
import com.nutriscan.dto.RegisterRequest;
import com.nutriscan.dto.UserDto;
import com.nutriscan.repository.UserRepository;
import com.nutriscan.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Registration, login and current-user lookup. Passwords are BCrypt-hashed; emails are
 * normalized to lowercase so login is case-insensitive and the unique constraint holds.
 *
 * <p>DPDP note: only the password hash is persisted, never the plaintext.
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        String email = req.email().trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ConflictException("That email is already registered");
        }

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(req.password()));
        user.setDisplayName(req.displayName().trim());
        user.setRole(Role.USER);
        user.setEnabled(true);
        userRepository.save(user);

        return new AuthResponse(jwtService.generate(user), UserDto.from(user));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest req) {
        // Same generic message for "no such user" and "wrong password" to avoid email enumeration.
        User user = userRepository.findByEmailIgnoreCase(req.email().trim())
                .orElseThrow(AuthService::invalidCredentials);

        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw invalidCredentials();
        }
        if (!user.isEnabled()) {
            throw new ApiException(HttpStatus.FORBIDDEN, "ACCOUNT_DISABLED", "This account is disabled");
        }

        return new AuthResponse(jwtService.generate(user), UserDto.from(user));
    }

    @Transactional(readOnly = true)
    public UserDto me(Long userId) {
        return userRepository.findById(userId)
                .map(UserDto::from)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private static ApiException invalidCredentials() {
        return new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "Invalid email or password");
    }
}
