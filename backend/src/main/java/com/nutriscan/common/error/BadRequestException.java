package com.nutriscan.common.error;

import org.springframework.http.HttpStatus;

/** 400 — the request is semantically invalid in a way bean validation can't express. */
public class BadRequestException extends ApiException {

    public BadRequestException(String message) {
        super(HttpStatus.BAD_REQUEST, "BAD_REQUEST", message);
    }
}
