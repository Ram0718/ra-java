package com.javamastery.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "question_progress", uniqueConstraints = {
    @UniqueConstraint(name = "uk_question_progress_user_question", columnNames = {"user_id", "question_id"})
}, indexes = {
    @Index(name = "idx_qprog_user", columnList = "user_id"),
    @Index(name = "idx_qprog_question", columnList = "question_id")
})
public class QuestionProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(name = "is_solved", nullable = false)
    private boolean solved = false;

    @Column(name = "attempts_count", nullable = false)
    private int attemptsCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "best_submission_id")
    private Submission bestSubmission;

    @Column(name = "first_solved_at")
    private LocalDateTime firstSolvedAt;

    public QuestionProgress() {}

    public QuestionProgress(User user, Question question) {
        this.user = user;
        this.question = question;
        this.solved = false;
        this.attemptsCount = 0;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Question getQuestion() { return question; }
    public void setQuestion(Question question) { this.question = question; }

    public boolean isSolved() { return solved; }
    public void setSolved(boolean solved) { this.solved = solved; }

    public int getAttemptsCount() { return attemptsCount; }
    public void setAttemptsCount(int attemptsCount) { this.attemptsCount = attemptsCount; }

    public Submission getBestSubmission() { return bestSubmission; }
    public void setBestSubmission(Submission bestSubmission) { this.bestSubmission = bestSubmission; }

    public LocalDateTime getFirstSolvedAt() { return firstSolvedAt; }
    public void setFirstSolvedAt(LocalDateTime firstSolvedAt) { this.firstSolvedAt = firstSolvedAt; }
}
