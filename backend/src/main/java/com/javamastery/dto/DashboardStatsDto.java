package com.javamastery.dto;

import java.time.LocalDateTime;
import java.util.List;

public class DashboardStatsDto {
    private String studentName;
    private String studentEmail;
    private int overallProgressPercentage;
    private int coreJavaCompletionPercentage;
    private long totalTopics;
    private long completedTopics;
    private long pendingTopics;
    private long totalCodingQuestions;
    private long solvedQuestions;
    private long failedQuestions;
    private long totalSubmissions;
    private double codingAccuracy;
    private int currentLearningStreakDays;
    private RecommendedTopicDto recommendedNextTopic;
    private long downloadedStudyMaterialsCount;
    private List<ModuleProgressSummaryDto> moduleProgressList;
    private List<RecentActivityDto> recentActivities;

    public DashboardStatsDto() {}

    public static class RecommendedTopicDto {
        private Long id;
        private String title;
        private String slug;
        private String moduleTitle;
        private int estimatedMinutes;

        public RecommendedTopicDto() {}

        public RecommendedTopicDto(Long id, String title, String slug, String moduleTitle, int estimatedMinutes) {
            this.id = id;
            this.title = title;
            this.slug = slug;
            this.moduleTitle = moduleTitle;
            this.estimatedMinutes = estimatedMinutes;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getSlug() { return slug; }
        public void setSlug(String slug) { this.slug = slug; }
        public String getModuleTitle() { return moduleTitle; }
        public void setModuleTitle(String moduleTitle) { this.moduleTitle = moduleTitle; }
        public int getEstimatedMinutes() { return estimatedMinutes; }
        public void setEstimatedMinutes(int estimatedMinutes) { this.estimatedMinutes = estimatedMinutes; }
    }

    public static class ModuleProgressSummaryDto {
        private Long moduleId;
        private String title;
        private String slug;
        private int moduleOrder;
        private int totalTopics;
        private int completedTopics;
        private int completionPercentage;

        public ModuleProgressSummaryDto() {}

        public ModuleProgressSummaryDto(Long moduleId, String title, String slug, int moduleOrder,
                                       int totalTopics, int completedTopics, int completionPercentage) {
            this.moduleId = moduleId;
            this.title = title;
            this.slug = slug;
            this.moduleOrder = moduleOrder;
            this.totalTopics = totalTopics;
            this.completedTopics = completedTopics;
            this.completionPercentage = completionPercentage;
        }

        public Long getModuleId() { return moduleId; }
        public void setModuleId(Long moduleId) { this.moduleId = moduleId; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getSlug() { return slug; }
        public void setSlug(String slug) { this.slug = slug; }
        public int getModuleOrder() { return moduleOrder; }
        public void setModuleOrder(int moduleOrder) { this.moduleOrder = moduleOrder; }
        public int getTotalTopics() { return totalTopics; }
        public void setTotalTopics(int totalTopics) { this.totalTopics = totalTopics; }
        public int getCompletedTopics() { return completedTopics; }
        public void setCompletedTopics(int completedTopics) { this.completedTopics = completedTopics; }
        public int getCompletionPercentage() { return completionPercentage; }
        public void setCompletionPercentage(int completionPercentage) { this.completionPercentage = completionPercentage; }
    }

    public static class RecentActivityDto {
        private String activityType;
        private String description;
        private LocalDateTime timestamp;

        public RecentActivityDto() {}

        public RecentActivityDto(String activityType, String description, LocalDateTime timestamp) {
            this.activityType = activityType;
            this.description = description;
            this.timestamp = timestamp;
        }

        public String getActivityType() { return activityType; }
        public void setActivityType(String activityType) { this.activityType = activityType; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public LocalDateTime getTimestamp() { return timestamp; }
        public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    }

    // Getters and setters
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public int getOverallProgressPercentage() { return overallProgressPercentage; }
    public void setOverallProgressPercentage(int overallProgressPercentage) { this.overallProgressPercentage = overallProgressPercentage; }

    public int getCoreJavaCompletionPercentage() { return coreJavaCompletionPercentage; }
    public void setCoreJavaCompletionPercentage(int coreJavaCompletionPercentage) { this.coreJavaCompletionPercentage = coreJavaCompletionPercentage; }

    public long getTotalTopics() { return totalTopics; }
    public void setTotalTopics(long totalTopics) { this.totalTopics = totalTopics; }

    public long getCompletedTopics() { return completedTopics; }
    public void setCompletedTopics(long completedTopics) { this.completedTopics = completedTopics; }

    public long getPendingTopics() { return pendingTopics; }
    public void setPendingTopics(long pendingTopics) { this.pendingTopics = pendingTopics; }

    public long getTotalCodingQuestions() { return totalCodingQuestions; }
    public void setTotalCodingQuestions(long totalCodingQuestions) { this.totalCodingQuestions = totalCodingQuestions; }

    public long getSolvedQuestions() { return solvedQuestions; }
    public void setSolvedQuestions(long solvedQuestions) { this.solvedQuestions = solvedQuestions; }

    public long getFailedQuestions() { return failedQuestions; }
    public void setFailedQuestions(long failedQuestions) { this.failedQuestions = failedQuestions; }

    public long getTotalSubmissions() { return totalSubmissions; }
    public void setTotalSubmissions(long totalSubmissions) { this.totalSubmissions = totalSubmissions; }

    public double getCodingAccuracy() { return codingAccuracy; }
    public void setCodingAccuracy(double codingAccuracy) { this.codingAccuracy = codingAccuracy; }

    public int getCurrentLearningStreakDays() { return currentLearningStreakDays; }
    public void setCurrentLearningStreakDays(int currentLearningStreakDays) { this.currentLearningStreakDays = currentLearningStreakDays; }

    public RecommendedTopicDto getRecommendedNextTopic() { return recommendedNextTopic; }
    public void setRecommendedNextTopic(RecommendedTopicDto recommendedNextTopic) { this.recommendedNextTopic = recommendedNextTopic; }

    public long getDownloadedStudyMaterialsCount() { return downloadedStudyMaterialsCount; }
    public void setDownloadedStudyMaterialsCount(long downloadedStudyMaterialsCount) { this.downloadedStudyMaterialsCount = downloadedStudyMaterialsCount; }

    public List<ModuleProgressSummaryDto> getModuleProgressList() { return moduleProgressList; }
    public void setModuleProgressList(List<ModuleProgressSummaryDto> moduleProgressList) { this.moduleProgressList = moduleProgressList; }

    public List<RecentActivityDto> getRecentActivities() { return recentActivities; }
    public void setRecentActivities(List<RecentActivityDto> recentActivities) { this.recentActivities = recentActivities; }
}
