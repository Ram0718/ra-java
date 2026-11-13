package com.javamastery.service;

import com.javamastery.entity.*;
import com.javamastery.exception.ResourceNotFoundException;
import com.javamastery.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final TopicRepository topicRepository;
    private final CourseModuleRepository moduleRepository;
    private final QuestionRepository questionRepository;
    private final TestCaseRepository testCaseRepository;
    private final CodeTemplateRepository codeTemplateRepository;
    private final SubmissionRepository submissionRepository;
    private final QuestionProgressRepository questionProgressRepository;
    private final TopicProgressRepository topicProgressRepository;
    private final LearningMaterialRepository materialRepository;
    private final UserSessionRepository sessionRepository;

    public AdminService(UserRepository userRepository,
                        PaymentRepository paymentRepository,
                        TopicRepository topicRepository,
                        CourseModuleRepository moduleRepository,
                        QuestionRepository questionRepository,
                        TestCaseRepository testCaseRepository,
                        CodeTemplateRepository codeTemplateRepository,
                        SubmissionRepository submissionRepository,
                        QuestionProgressRepository questionProgressRepository,
                        TopicProgressRepository topicProgressRepository,
                        LearningMaterialRepository materialRepository,
                        UserSessionRepository sessionRepository) {
        this.userRepository = userRepository;
        this.paymentRepository = paymentRepository;
        this.topicRepository = topicRepository;
        this.moduleRepository = moduleRepository;
        this.questionRepository = questionRepository;
        this.testCaseRepository = testCaseRepository;
        this.codeTemplateRepository = codeTemplateRepository;
        this.submissionRepository = submissionRepository;
        this.questionProgressRepository = questionProgressRepository;
        this.topicProgressRepository = topicProgressRepository;
        this.materialRepository = materialRepository;
        this.sessionRepository = sessionRepository;
    }

    public Map<String, Object> getAdminAnalytics() {
        long totalStudents = userRepository.count();
        long paidStudents = userRepository.countByPaymentStatus("COMPLETED");
        BigDecimal totalRevenue = paymentRepository.calculateTotalVerifiedRevenue();
        long totalSubmissions = submissionRepository.count();
        long acceptedSubmissions = submissionRepository.countByStatus("ACCEPTED");
        long totalQuestions = questionRepository.count();
        long totalTopics = topicRepository.count();

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalStudents", totalStudents);
        analytics.put("paidStudents", paidStudents);
        analytics.put("totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO);
        analytics.put("totalSubmissions", totalSubmissions);
        analytics.put("acceptedSubmissions", acceptedSubmissions);
        analytics.put("totalQuestions", totalQuestions);
        analytics.put("totalTopics", totalTopics);

        double platformAccuracy = totalSubmissions > 0
                ? Math.round((double) acceptedSubmissions * 1000.0 / totalSubmissions) / 10.0
                : 0.0;
        analytics.put("platformAccuracy", platformAccuracy);

        // Modules summary
        List<CourseModule> modules = moduleRepository.findAllByOrderByModuleOrderAsc();
        List<Map<String, Object>> moduleMetrics = new ArrayList<>();
        for (CourseModule m : modules) {
            Map<String, Object> mm = new HashMap<>();
            mm.put("title", m.getTitle());
            mm.put("slug", m.getSlug());
            List<Topic> topics = topicRepository.findByModuleOrderByTopicOrderAsc(m);
            mm.put("topicsCount", topics.size());
            moduleMetrics.add(mm);
        }
        analytics.put("moduleMetrics", moduleMetrics);

        return analytics;
    }

    public List<Map<String, Object>> getStudentsList() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (User u : users) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("email", u.getEmail());
            map.put("fullName", u.getFullName());
            map.put("role", u.getRole());
            map.put("paymentStatus", u.getPaymentStatus());
            map.put("courseAccess", u.isCourseAccess());
            map.put("active", u.isActive());
            map.put("createdAt", u.getCreatedAt());

            long solved = questionProgressRepository.countByUserAndSolvedTrue(u);
            long totalSubs = submissionRepository.countByUser(u);
            long activeSessions = sessionRepository.findByUserAndActiveTrue(u).size();

            map.put("solvedQuestions", solved);
            map.put("totalSubmissions", totalSubs);
            map.put("activeSessions", activeSessions);

            result.add(map);
        }
        return result;
    }

    @Transactional
    public boolean toggleStudentStatus(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setActive(!user.isActive());
        if (!user.isActive()) {
            // Revoke all active sessions immediately
            sessionRepository.revokeAllActiveSessionsForUser(userId, java.time.LocalDateTime.now());
        }
        userRepository.save(user);
        return user.isActive();
    }

    @Transactional
    public Question createQuestion(Long topicId, Question question, List<TestCase> testCases, String starterCode) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found"));

        question.setTopic(topic);
        Question saved = questionRepository.save(question);

        if (testCases != null) {
            int order = 1;
            for (TestCase tc : testCases) {
                tc.setQuestion(saved);
                tc.setTestOrder(order++);
                testCaseRepository.save(tc);
            }
        }

        if (starterCode != null && !starterCode.isBlank()) {
            CodeTemplate template = new CodeTemplate(saved, starterCode, null);
            codeTemplateRepository.save(template);
        }

        return saved;
    }

    @Transactional
    public LearningMaterial uploadMaterial(Long topicId, String title, String pdfUrl, long fileSizeBytes) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found"));
        LearningMaterial lm = new LearningMaterial(topic, title, pdfUrl, fileSizeBytes);
        return materialRepository.save(lm);
    }
}
