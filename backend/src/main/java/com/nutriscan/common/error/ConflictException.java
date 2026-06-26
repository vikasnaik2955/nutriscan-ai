package com.nutriscan.common.error;

import org.springframework.http.HttpStatus;

/** 409 — the request conflicts with current state (e.g. email already registered). */
public class ConflictException extends ApiException {

    public ConflictException(String message) {
        super(HttpStatus.CONFLICT, "CONFLICT", message);
    }
}
