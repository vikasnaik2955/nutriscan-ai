package com.nutriscan.security;

import com.nutriscan.domain.Role;

/** The verified, decoded contents of a JWT. */
public record JwtPayload(Long userId, String email, Role role) {
}
