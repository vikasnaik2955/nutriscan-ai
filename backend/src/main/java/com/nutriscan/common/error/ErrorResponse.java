package com.nutriscan.common.error;

import java.time.Instant;
import java.util.List;

/**
 * The single error envelope returned by every endpoint. Example:
 * <pre>
 * {
 *   "timestamp": "2026-06-26T10:15:30Z",
 *   "status": 400,
 *   "error": "Bad Request",
 *   "code": "VALIDATION_ERROR",
 *   "message": "Request validation failed",
 *   "path": "/api/auth/register",
 *   "details": [ { "field": "email", "message": "must be a well-formed email address" } ]
 * }
 * </pre>
 * Null fields (e.g. empty {@code details}) are omitted by the global Jackson config.
 */
public record ErrorResponse(
        Instant timestamp,
        int status,
        String error,
        String code,
        String message,
        String path,
        List<FieldError> details
) {
    /** One field-level validation failure. */
    public record FieldError(String field, String message) {
    }
}
