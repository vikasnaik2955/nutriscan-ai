package com.nutriscan.repository;

import com.nutriscan.domain.Scan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ScanRepository extends JpaRepository<Scan, Long> {

    /** A user's own history, newest first. */
    Page<Scan> findByUserId(Long userId, Pageable pageable);

    /** Fetch a single scan scoped to its owner (prevents cross-user access). */
    Optional<Scan> findByIdAndUserId(Long id, Long userId);

    /** Owner-scoped delete; returns the number of rows removed (0 if not found/not owned). */
    long deleteByIdAndUserId(Long id, Long userId);
}
