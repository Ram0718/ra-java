package com.javamastery.service;

import com.javamastery.dto.DashboardStatsDto;
import com.javamastery.dto.DashboardStatsDto.*;
import com.javamastery.entity.*;
import com.javamastery.exception.ResourceNotFoundException;
import com.javamastery.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final TopicRepository topicRepository;
    private final CourseModuleRepository moduleRepository;
    private final QuestionRepository questionRepository;
    private final QuestionProgressRepository questionProgressRepository;
    private final TopicProgressRepository topicProgressRepository;
    private final SubmissionRepository submissionRepository;
    private final StudentActivityRepository studentActivityRepository;

    public DashboardService(UserRepository userRepository,
                            TopicRepository topicRepository,
                            CourseModuleRepository moduleRepository,
                            QuestionRepository questionRepository,
                            QuestionProgressRepository questionProgressRepository,
                            TopicProgressRepository topicProgressRepository,
                            SubmissionRepository submissionRepository,
                            StudentActivityRepository studentActivityRepository) {
        this.userRepository = userRepository;
        this.topicRepository = topicRepository;
        this.moduleRepository = moduleRepository;
        this.questionRepository = questionRepository;
        this.questionProgressRepository = questionProgressRepository;
        this.topicProgressRepository = topicProgressRepository;
        this.submissionRepository = submissionRepository;
        this.studentActivityRepository = studentActivityRepository;
    }

    public DashboardStatsDto calculateStudentDashboard(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        DashboardStatsDto stats = new DashboardStatsDto();
        stats.setStudentName(user.getFullName());
        stats.setStudentEmail(user.getEmail());

        // 1. Topic Metrics
        long totalTopics = topicRepository.countByPublishedTrue();
        long completedTopics = topicProgressRepository.countByUserAndStatus(user, "COMPLETED");
        long pendingTopics = Math.max(0, totalTopics - completedTopics);
        int overallProgress = totalTopics > 0 ? (int) Math.round((double) completedTopics * 100 / totalTopics) : 0;

        stats.setTotalTopics(totalTopics);
        stats.setCompletedTopics(completedTopics);
        stats.setPendingTopics(pendingTopics);
        stats.setOverallProgressPercentage(overallProgress);
        stats.setCoreJavaCompletionPercentage(overallProgress);

        // 2. Question Metrics
        long totalQuestions = questionRepository.countByPublishedTrue();
        long solvedQuestions = questionProgressRepository.countByUserAndSolvedTrue(user);
        List<QuestionProgress> allUserQProgress = questionProgressRepository.findByUser(user);
        long failedQuestions = allUserQProgress.stream().filter(qp -> !qp.isSolved() && qp.getAttemptsCount() > 0).count();

        stats.setTotalCodingQuestions(totalQuestions);
        stats.setSolvedQuestions(solvedQuestions);
        stats.setFailedQuestions(failedQuestions);

        // 3. Submissions & Accuracy
        long totalSubmissions = submissionRepository.countByUser(user);
        long acceptedSubmissions = submissionRepository.countByUserAndStatus(user, "ACCEPTED");
        double accuracy = totalSubmissions > 0
                ? Math.round((double) acceptedSubmissions * 1000.0 / totalSubmissions) / 10.0
                : 0.0;

        stats.setTotalSubmissions(totalSubmissions);
        stats.setCodingAccuracy(accuracy);

        // 4. Learning Streak Calculation
        stats.setCurrentLearningStreakDays(calculateStreak(user));

        // 5. Downloaded Materials Count
        List<StudentActivity> allActs = studentActivityRepository.findByUserOrderByCreatedAtDesc(user);
        long downloadCount = allActs.stream().filter(a -> "PDF_DOWNLOAD".equals(a.getActivityType())).count();
        stats.setDownloadedStudyMaterialsCount(downloadCount);

        // 6. Recommended Next Topic
        List<Topic> allTopics = topicRepository.findByPublishedTrueOrderByModule_ModuleOrderAscTopicOrderAsc();
        Map<Long, String> completedTopicIds = new HashMap<>();
        for (TopicProgress tp : topicProgressRepository.findByUser(user)) {
            if ("COMPLETED".equals(tp.getStatus())) {
                completedTopicIds.put(tp.getTopic().getId(), "COMPLETED");
            }
        }

        RecommendedTopicDto nextTopic = null;
        for (Topic t : allTopics) {
            if (!completedTopicIds.containsKey(t.getId())) {
                nextTopic = new RecommendedTopicDto(
                        t.getId(),
                        t.getTitle(),
                        t.getSlug(),
                        t.getModule().getTitle(),
                        t.getEstimatedMinutes()
                );
                break;
            }
        }
        if (nextTopic == null && !allTopics.isEmpty()) {
            Topic first = allTopics.get(0);
            nextTopic = new RecommendedTopicDto(first.getId(), first.getTitle(), first.getSlug(), first.getModule().getTitle(), first.getEstimatedMinutes());
        }
        stats.setRecommendedNextTopic(nextTopic);

        // 7. Module Progress Breakdown
        List<CourseModule> modules = moduleRepository.findByPublishedTrueOrderByModuleOrderAsc();
        List<ModuleProgressSummaryDto> moduleProgressList = new ArrayList<>();
        for (CourseModule m : modules) {
            List<Topic> moduleTopics = topicRepository.findByModuleAndPublishedTrueOrderByTopicOrderAsc(m);
            int mCompleted = 0;
            for (Topic mt : moduleTopics) {
                if (completedTopicIds.containsKey(mt.getId())) {
                    mCompleted++;
                }
            }
            int mPerc = moduleTopics.isEmpty() ? 0 : (int) Math.round((double) mCompleted * 100 / moduleTopics.size());
            moduleProgressList.add(new ModuleProgressSummaryDto(
                    m.getId(), m.getTitle(), m.getSlug(), m.getModuleOrder(),
                    moduleTopics.size(), mCompleted, mPerc
            ));
        }
        stats.setModuleProgressList(moduleProgressList);

        // 8. Recent Activity
        List<RecentActivityDto> recentDtos = new ArrayList<>();
        List<StudentActivity> top10 = studentActivityRepository.findTop10ByUserOrderByCreatedAtDesc(user);
        for (StudentActivity a : top10) {
            String desc = formatActivityDescription(a.getActivityType(), a.getMetadataJson());
            recentDtos.add(new RecentActivityDto(a.getActivityType(), desc, a.getCreatedAt()));
        }
        stats.setRecentActivities(recentDtos);

        return stats;
    }

    private int calculateStreak(User user) {
        List<StudentActivity> acts = studentActivityRepository.findByUserOrderByCreatedAtDesc(user);
        if (acts.isEmpty()) return 0;

        Set<LocalDate> activityDates = new TreeSet<>(Collections.reverseOrder());
        for (StudentActivity act : acts) {
            activityDates.add(act.getCreatedAt().toLocalDate());
        }

        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        // If no activity today or yesterday, streak is broken
        if (!activityDates.contains(today) && !activityDates.contains(yesterday)) {
            return 0;
        }

        int streak = 0;
        LocalDate current = activityDates.contains(today) ? today : yesterday;

        while (activityDates.contains(current)) {
            streak++;
            current = current.minusDays(1);
        }

        return streak;
    }

    private String formatActivityDescription(String type, String metadata) {
        if ("LOGIN".equals(type)) return "Signed in from secure session";
        if ("PAYMENT_SUCCESS".equals(type)) return "Enrolled in Lifetime Java Mastery Access (₹99)";
        if ("TOPIC_VIEW".equals(type)) return "Reviewed course learning notes";
        if ("MATERIAL_READ".equals(type)) return "Completed reading topic theory";
        if ("CODE_SUBMIT".equals(type)) return "Submitted Java code for evaluation";
        if ("PDF_DOWNLOAD".equals(type)) return "Downloaded study material PDF";
        if ("ASSESSMENT_PASSED".equals(type)) return "Passed topic assessment examination";
        return type;
    }
}
