package com.nutriscan.dto;

/** Response for register/login: the JWT plus the authenticated user. Matches the app's AuthResponse type. */
public record AuthResponse(String token, UserDto user) {
}
