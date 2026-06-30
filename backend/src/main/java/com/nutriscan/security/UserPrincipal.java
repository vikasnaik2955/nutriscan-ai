package com.nutriscan.security;

import com.nutriscan.domain.Role;

/**
 * The authenticated principal placed in the SecurityContext by {@link JwtAuthenticationFilter}.
 * Inject into controllers with {@code @AuthenticationPrincipal UserPrincipal principal}.
 */
public record UserPrincipal(Long id, String email, Role role) {
}
