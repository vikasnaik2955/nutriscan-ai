package com.nutriscan.common.error;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Base for application-thrown errors that map cleanly to an HTTP response.
 * Carries both the {@link HttpStatus} and a stable machine-readable {@code code}
 * that clients can switch on.
 */
@Getter
public class ApiException extends RuntimeException {

    private final HttpStatus status;
    private final String code;

    public ApiException(HttpStatus status, String code, String message) {
        super(message);
        this.status = status;
        this.code = code;
    }
}
