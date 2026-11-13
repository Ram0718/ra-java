package com.javamastery.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "assessments", indexes = {
    @Index(name = "idx_assessment_topic", columnList = "topic_id")
})
public class Assessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "topic_id", nullable = false, unique = true)
    private Topic topic;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(name = "passing_score", nullable = false)
    private int passingScore = 70; // percentage

    @Column(name = "time_limit_minutes", nullable = false)
    private int timeLimitMinutes = 15;

    @OneToMany(mappedBy = "assessment", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<AssessmentQuestion> questions = new ArrayList<>();

    public Assessment() {}

    public Assessment(Topic topic, String title, int passingScore, int timeLimitMinutes) {
        this.topic = topic;
        this.title = title;
        this.passingScore = passingScore;
        this.timeLimitMinutes = timeLimitMinutes;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Topic getTopic() { return topic; }
    public void setTopic(Topic topic) { this.topic = topic; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public int getPassingScore() { return passingScore; }
    public void setPassingScore(int passingScore) { this.passingScore = passingScore; }

    public int getTimeLimitMinutes() { return timeLimitMinutes; }
    public void setTimeLimitMinutes(int timeLimitMinutes) { this.timeLimitMinutes = timeLimitMinutes; }

    public List<AssessmentQuestion> getQuestions() { return questions; }
    public void setQuestions(List<AssessmentQuestion> questions) { this.questions = questions; }
}
