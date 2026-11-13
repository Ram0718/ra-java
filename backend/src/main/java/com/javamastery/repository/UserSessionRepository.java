package com.javamastery.repository;

import com.javamastery.entity.User;
import com.javamastery.entity.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserSessionRepository extends JpaRepository<UserSession, UUID> {

    Optional<UserSession> findBySessionTokenAndActiveTrue(String sessionToken);

    List<UserSession> findByUserAndActiveTrue(User user);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE UserSession s SET s.active = false, s.revokedAt = :revokedAt WHERE s.user.id = :userId AND s.active = true")
    void revokeAllActiveSessionsForUser(@Param("userId") UUID userId, @Param("revokedAt") LocalDateTime revokedAt);
}
