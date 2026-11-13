package com.javamastery.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "code_templates")
public class CodeTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Lob
    @Column(name = "starter_code", columnDefinition = "TEXT", nullable = false)
    private String starterCode;

    @Lob
    @Column(name = "driver_code", columnDefinition = "TEXT")
    private String driverCode;

    public CodeTemplate() {}

    public CodeTemplate(Question question, String starterCode, String driverCode) {
        this.question = question;
        this.starterCode = starterCode;
        this.driverCode = driverCode;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Question getQuestion() { return question; }
    public void setQuestion(Question question) { this.question = question; }

    public String getStarterCode() { return starterCode; }
    public void setStarterCode(String starterCode) { this.starterCode = starterCode; }

    public String getDriverCode() { return driverCode; }
    public void setDriverCode(String driverCode) { this.driverCode = driverCode; }
}
