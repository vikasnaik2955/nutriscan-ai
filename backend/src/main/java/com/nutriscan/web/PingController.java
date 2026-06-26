package com.nutriscan.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

/** Trivial liveness endpoint to confirm the app + DB wiring booted. Replaced/augmented later. */
@RestController
@RequestMapping("/api")
public class PingController {

    @GetMapping("/ping")
    public Map<String, Object> ping() {
        return Map.of(
                "service", "nutriscan-backend",
                "status", "ok",
                "time", Instant.now().toString()
        );
    }
}
