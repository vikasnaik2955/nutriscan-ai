package com.nutriscan.dto;

import com.nutriscan.domain.User;

/** Public view of a user — never exposes the password hash. */
public record UserDto(Long id, String email, String displayName, String role) {

    public static UserDto from(User user) {
        return new UserDto(user.getId(), user.getEmail(), user.getDisplayName(), user.getRole().name());
    }
}
