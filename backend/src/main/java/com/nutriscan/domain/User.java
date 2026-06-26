package com.nutriscan.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * An application user.
 *
 * <p>DPDP note: this row holds personal data (email, display name). Only the BCrypt
 * password <em>hash</em> is stored, never the plaintext. See {@link Scan} for the
 * activity data this user generates.
 */
@Entity
@Table(
        name = "users",
        indexes = @Index(name = "ux_users_email", columnList = "email", unique = true)
)
@Getter
@Setter
@NoArgsConstructor
public class User extends BaseEntity {

    @Column(nullable = false, unique = true, length = 190)
    private String email;

    /** BCrypt hash. Populated by the auth service in build #2. */
    @Column(name = "password_hash", nullable = false, length = 100)
    private String passwordHash;

    @Column(name = "display_name", length = 120)
    private String displayName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role = Role.USER;

    @Column(nullable = false)
    private boolean enabled = true;
}
