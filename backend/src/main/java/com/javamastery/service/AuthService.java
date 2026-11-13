package com.javamastery.service;

import com.javamastery.dto.*;
import com.javamastery.entity.StudentActivity;
import com.javamastery.entity.User;
import com.javamastery.entity.UserSession;
import com.javamastery.exception.BadRequestException;
import com.javamastery.exception.ResourceNotFoundException;
import com.javamastery.exception.UnauthorizedException;
import com.javamastery.repository.StudentActivityRepository;
import com.javamastery.repository.UserRepository;
import com.javamastery.repository.UserSessionRepository;
import com.javamastery.security.JwtService;
import com.javamastery.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final UserSessionRepository userSessionRepository;
    private final StudentActivityRepository studentActivityRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.jwt.expiration-ms:86400000}")
    private long jwtExpirationMs;

    // Brute-force protection: track failed admin login attempts & lockout expiries per IP/email
    private final Map<String, Integer> failedAttempts = new ConcurrentHashMap<>();
    private final Map<String, Long> lockoutExpiry = new ConcurrentHashMap<>();

    public AuthService(UserRepository userRepository,
                       UserSessionRepository userSessionRepository,
                       StudentActivityRepository studentActivityRepository,
                       JwtService jwtService,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userSessionRepository = userSessionRepository;
        this.studentActivityRepository = studentActivityRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public AuthResponse authenticateGoogleUser(AuthRequest request, String clientIp) {
        String rawName = (request.getFullName() != null && !request.getFullName().isBlank())
                ? request.getFullName().trim()
                : "Student";

        String email;
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            email = request.getEmail().trim().toLowerCase();
        } else {
            String sanitized = rawName.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
            if (sanitized.isBlank()) sanitized = "learner";
            email = sanitized + "@rajava.dev";
        }

        // SECURITY GATE: Prevent privilege escalation. Admin accounts CANNOT authenticate via student social login!
        if (email.equalsIgnoreCase("admin@javamastery.com") || email.equalsIgnoreCase("admin@rajava.com")) {
            throw new UnauthorizedException("Administrative accounts must authenticate exclusively via the secure Admin Portal.");
        }

        String fullName = rawName;
        String profileImageUrl = request.getProfileImageUrl() != null
                ? request.getProfileImageUrl()
                : "https://api.dicebear.com/7.x/initials/svg?seed=" + email;

        // 1. One registered account per verified email (Get or Create)
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User(email, fullName, profileImageUrl);
            newUser.setRole("ROLE_STUDENT"); // ALWAYS strictly enforce student role
            newUser.setCourseAccess(true);
            newUser.setPaymentStatus("FREE");
            return userRepository.save(newUser);
        });

        // Double check: If the user in DB is an admin, forbid social login access!
        if ("ROLE_ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new UnauthorizedException("Administrative accounts must authenticate exclusively via the secure Admin Portal.");
        }

        // Ensure full free access is always enabled for all students
        if (!user.isCourseAccess()) {
            user.setCourseAccess(true);
            user.setPaymentStatus("FREE");
            user = userRepository.save(user);
        }

        if (!user.isActive()) {
            throw new UnauthorizedException("Account has been suspended. Please contact platform support.");
        }

        // 2. Single-account policy: Invalidate ALL previous active sessions for this student
        LocalDateTime now = LocalDateTime.now();
        userSessionRepository.revokeAllActiveSessionsForUser(user.getId(), now);

        // 3. Create a new active session
        LocalDateTime expiresAt = now.plusSeconds(jwtExpirationMs / 1000);
        String sessionToken = UUID.randomUUID().toString();
        UserSession newSession = new UserSession(user, sessionToken, request.getDeviceInfo(), clientIp, expiresAt);
        newSession = userSessionRepository.save(newSession);

        // 4. Generate JWT with the unique sessionId
        String jwt = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole(), newSession.getId());

        // 5. Record activity
        studentActivityRepository.save(new StudentActivity(user, "LOGIN",
                "{\"device\":\"" + (request.getDeviceInfo() != null ? request.getDeviceInfo() : "Web") + "\", \"ip\":\"" + clientIp + "\"}"));

        UserDto userDto = toUserDto(user);
        return new AuthResponse(jwt, userDto);
    }

    @Transactional
    public AuthResponse authenticateAdmin(AdminLoginRequest request, String clientIp) {
        if (request.getEmail() == null || request.getPassword() == null) {
            throw new BadRequestException("Email and password are required");
        }

        String email = request.getEmail().trim().toLowerCase();
        String lockKey = clientIp + ":" + email;

        // Check if temporarily locked out due to excessive failed attempts
        Long lockedUntil = lockoutExpiry.get(lockKey);
        if (lockedUntil != null) {
            long now = System.currentTimeMillis();
            if (now < lockedUntil) {
                long remainingSec = (lockedUntil - now) / 1000;
                throw new UnauthorizedException("Too many failed admin login attempts. Account temporarily locked for " + remainingSec + " more seconds.");
            } else {
                lockoutExpiry.remove(lockKey);
                failedAttempts.remove(lockKey);
            }
        }

        // Check admin credentials with constant-time equality check
        boolean validEmail = email.equalsIgnoreCase("admin@rajava.com") || email.equalsIgnoreCase("admin@javamastery.com");
        boolean validPassword = securePasswordMatch(request.getPassword(), "Admin@RAJava2025!")
                || securePasswordMatch(request.getPassword(), "Admin@JavaMastery2025!");

        if (!validEmail || !validPassword) {
            int currentFails = failedAttempts.getOrDefault(lockKey, 0) + 1;
            failedAttempts.put(lockKey, currentFails);
            if (currentFails >= 5) {
                // Lock for 15 minutes
                lockoutExpiry.put(lockKey, System.currentTimeMillis() + (15 * 60 * 1000L));
                failedAttempts.remove(lockKey);
                throw new UnauthorizedException("Security Alert: Excessive failed admin attempts. Portal is locked for 15 minutes.");
            }
            throw new UnauthorizedException("Invalid admin credentials. " + (5 - currentFails) + " attempts remaining before lockout.");
        }

        // Credentials are valid -> reset failed attempts
        failedAttempts.remove(lockKey);
        lockoutExpiry.remove(lockKey);

        User admin = userRepository.findByEmail(email).orElseGet(() -> {
            User newAdmin = new User(email, "Platform Administrator", "https://api.dicebear.com/7.x/bottts/svg?seed=admin");
            newAdmin.setRole("ROLE_ADMIN");
            newAdmin.setCourseAccess(true);
            newAdmin.setPaymentStatus("COMPLETED");
            return userRepository.save(newAdmin);
        });

        if (!admin.isCourseAccess()) {
            admin.setCourseAccess(true);
            admin.setPaymentStatus("COMPLETED");
            admin = userRepository.save(admin);
        }

        LocalDateTime now = LocalDateTime.now();
        userSessionRepository.revokeAllActiveSessionsForUser(admin.getId(), now);

        LocalDateTime expiresAt = now.plusSeconds(jwtExpirationMs / 1000);
        String sessionToken = UUID.randomUUID().toString();
        UserSession newSession = new UserSession(admin, sessionToken, "Admin Console", clientIp, expiresAt);
        newSession = userSessionRepository.save(newSession);

        String jwt = jwtService.generateToken(admin.getId(), admin.getEmail(), admin.getRole(), newSession.getId());
        return new AuthResponse(jwt, toUserDto(admin));
    }

    private boolean securePasswordMatch(String provided, String expected) {
        if (provided == null || expected == null) return false;
        return MessageDigest.isEqual(
                provided.getBytes(StandardCharsets.UTF_8),
                expected.getBytes(StandardCharsets.UTF_8)
        );
    }

    @Transactional
    public void logout(UUID sessionId) {
        if (sessionId != null) {
            userSessionRepository.findById(sessionId).ifPresent(session -> {
                session.setActive(false);
                session.setRevokedAt(LocalDateTime.now());
                userSessionRepository.save(session);
            });
        }
    }

    public UserDto getCurrentUserDto(UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return toUserDto(user);
    }

    public User getUserEntity(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public UserDto toUserDto(User user) {
        return new UserDto(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getProfileImageUrl(),
                user.getRole(),
                user.getPaymentStatus(),
                user.isCourseAccess(),
                user.getCreatedAt()
        );
    }
}
