package com.javamastery.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "topic_progress", uniqueConstraints = {
    @UniqueConstraint(name = "uk_topic_progress_user_topic", columnNames = {"user_id", "topic_id"})
}, indexes = {
    @Index(name = "idx_topic_progress_user", columnList = "user_id"),
    @Index(name = "idx_topic_progress_topic", columnList = "topic_id")
})
public class TopicProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    @Column(nullable = false, length = 25)
    private String status = "NOT_STARTED"; // NOT_STARTED, IN_PROGRESS, COMPLETED

    @Column(name = "material_read", nullable = false)
    private boolean materialRead = false;

    @Column(name = "exercises_completed", nullable = false)
    private boolean exercisesCompleted = false;

    @Column(name = "assessment_passed", nullable = false)
    private boolean assessmentPassed = false;

    @Column(name = "time_spent_seconds", nullable = false)
    private int timeSpentSeconds = 0;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public TopicProgress() {}

    public TopicProgress(User user, Topic topic) {
        this.user = user;
        this.topic = topic;
        this.status = "NOT_STARTED";
    }

    public void recalculateStatus() {
        if (materialRead && exercisesCompleted && assessmentPassed) {
            this.status = "COMPLETED";
            if (this.completedAt == null) {
                this.completedAt = LocalDateTime.now();
            }
        } else if (materialRead || exercisesCompleted || assessmentPassed || timeSpentSeconds > 0) {
            this.status = "IN_PROGRESS";
            this.completedAt = null;
        } else {
            this.status = "NOT_STARTED";
            this.completedAt = null;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Topic getTopic() { return topic; }
    public void setTopic(Topic topic) { this.topic = topic; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isMaterialRead() { return materialRead; }
    public void setMaterialRead(boolean materialRead) {
        this.materialRead = materialRead;
        recalculateStatus();
    }

    public boolean isExercisesCompleted() { return exercisesCompleted; }
    public void setExercisesCompleted(boolean exercisesCompleted) {
        this.exercisesCompleted = exercisesCompleted;
        recalculateStatus();
    }

    public boolean isAssessmentPassed() { return assessmentPassed; }
    public void setAssessmentPassed(boolean assessmentPassed) {
        this.assessmentPassed = assessmentPassed;
        recalculateStatus();
    }

    public int getTimeSpentSeconds() { return timeSpentSeconds; }
    public void setTimeSpentSeconds(int timeSpentSeconds) {
        this.timeSpentSeconds = timeSpentSeconds;
        recalculateStatus();
    }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
