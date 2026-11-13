package com.javamastery;

import com.javamastery.dto.*;
import com.javamastery.entity.*;
import com.javamastery.repository.*;
import com.javamastery.security.JwtService;
import com.javamastery.service.AuthService;
import com.javamastery.service.DashboardService;
import com.javamastery.service.PaymentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev")
@Transactional
class JavaMasteryApplicationTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserSessionRepository userSessionRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private TopicProgressRepository topicProgressRepository;

    @Autowired
    private JwtService jwtService;

    @Test
    void contextLoads() {
        assertNotNull(authService);
        assertNotNull(paymentService);
        assertNotNull(dashboardService);
    }

    @Test
    @DisplayName("Single-session policy: New device login must invalidate previous session")
    void testSingleSessionInvalidation() {
        String email = "student.singlesession@test.com";

        // First login: Device 1 (Chrome on Windows)
        AuthRequest req1 = new AuthRequest();
        req1.setEmail(email);
        req1.setFullName("Rohan Gupta");
        req1.setDeviceInfo("Chrome on Windows");
        AuthResponse resp1 = authService.authenticateGoogleUser(req1, "192.168.1.10");

        assertNotNull(resp1.getToken());
        UUID session1Id = jwtService.extractSessionId(resp1.getToken());
        assertNotNull(session1Id);

        // Verify session 1 is active
        UserSession s1 = userSessionRepository.findById(session1Id).orElseThrow();
        assertTrue(s1.isActive());

        // Second login: Device 2 (Safari on iPhone)
        AuthRequest req2 = new AuthRequest();
        req2.setEmail(email);
        req2.setFullName("Rohan Gupta");
        req2.setDeviceInfo("Safari on iPhone");
        AuthResponse resp2 = authService.authenticateGoogleUser(req2, "192.168.1.20");

        assertNotNull(resp2.getToken());
        UUID session2Id = jwtService.extractSessionId(resp2.getToken());
        assertNotNull(session2Id);
        assertNotEquals(session1Id, session2Id);

        // Verify session 1 was automatically invalidated and revoked
        UserSession s1After = userSessionRepository.findById(session1Id).orElseThrow();
        assertFalse(s1After.isActive(), "Previous active session must be invalidated upon new login");
        assertNotNull(s1After.getRevokedAt());

        // Verify session 2 is currently active
        UserSession s2 = userSessionRepository.findById(session2Id).orElseThrow();
        assertTrue(s2.isActive());
    }

    @Test
    @DisplayName("Payment verification: Valid HMAC-SHA256 activates course access")
    void testPaymentOrderAndVerification() {
        // Create user with pending status to test payment activation flow
        User user = new User("paytest@test.com", "Payment Student", null);
        user.setCourseAccess(false);
        user.setPaymentStatus("PENDING");
        user = userRepository.save(user);
        assertFalse(user.isCourseAccess());
        assertEquals("PENDING", user.getPaymentStatus());

        // 1. Create order
        PaymentOrderResponse orderResp = paymentService.createOrder(user.getId());
        assertNotNull(orderResp.getOrderId());
        assertEquals(99.00, orderResp.getAmount().doubleValue());
        assertEquals("INR", orderResp.getCurrency());

        // 2. Compute signature
        String paymentId = "pay_rzp_mock_" + System.currentTimeMillis();
        String validSig = paymentService.generateHmacHex(orderResp.getOrderId() + "|" + paymentId, "secret_mock_key_99inr_verif");

        // 3. Verify Payment
        PaymentVerifyRequest verifyReq = new PaymentVerifyRequest(orderResp.getOrderId(), paymentId, validSig);
        PaymentVerifyResponse verifyResp = paymentService.verifyPayment(user.getId(), verifyReq);

        assertTrue(verifyResp.isVerified());
        assertTrue(verifyResp.isCourseAccess());

        // Verify DB update
        User updatedUser = userRepository.findById(user.getId()).orElseThrow();
        assertTrue(updatedUser.isCourseAccess());
        assertEquals("COMPLETED", updatedUser.getPaymentStatus());
    }

    @Test
    @DisplayName("Dashboard: Metrics must be dynamically calculated from database")
    void testDashboardDynamicCalculation() {
        User user = new User("dashstudent@test.com", "Dashboard Student", null);
        user = userRepository.save(user);

        DashboardStatsDto stats = dashboardService.calculateStudentDashboard(user.getId());
        assertNotNull(stats);
        assertEquals("Dashboard Student", stats.getStudentName());
        assertTrue(stats.getTotalTopics() > 0);
        assertEquals(0, stats.getCompletedTopics());
        assertEquals(stats.getTotalTopics(), stats.getPendingTopics());
        assertEquals(0, stats.getOverallProgressPercentage());
        assertNotNull(stats.getRecommendedNextTopic());

        // Now complete 1 topic
        Topic firstTopic = topicRepository.findAll().get(0);
        TopicProgress tp = new TopicProgress(user, firstTopic);
        tp.setMaterialRead(true);
        tp.setExercisesCompleted(true);
        tp.setAssessmentPassed(true);
        topicProgressRepository.save(tp);

        DashboardStatsDto statsAfter = dashboardService.calculateStudentDashboard(user.getId());
        assertEquals(1, statsAfter.getCompletedTopics());
        assertTrue(statsAfter.getOverallProgressPercentage() > 0);
    }
}
