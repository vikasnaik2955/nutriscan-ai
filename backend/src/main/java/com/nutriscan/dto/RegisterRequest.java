package com.nutriscan.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Body for POST /api/auth/register. Password max 72 — BCrypt's input limit. */
public record RegisterRequest(
        @NotBlank @Email @Size(max = 190) String email,
        @NotBlank @Size(min = 8, max = 72) String password,
        @NotBlank @Size(min = 2, max = 120) String displayName
) {
}
