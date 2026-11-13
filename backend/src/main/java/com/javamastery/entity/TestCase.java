package com.javamastery.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "test_cases", indexes = {
    @Index(name = "idx_test_case_question", columnList = "question_id")
})
public class TestCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Lob
    @Column(name = "input_data", columnDefinition = "TEXT", nullable = false)
    private String inputData;

    @Lob
    @Column(name = "expected_output", columnDefinition = "TEXT", nullable = false)
    private String expectedOutput;

    @Column(name = "is_hidden", nullable = false)
    private boolean hidden = false;

    @Column(name = "test_order", nullable = false)
    private int testOrder;

    public TestCase() {}

    public TestCase(Question question, String inputData, String expectedOutput, boolean hidden, int testOrder) {
        this.question = question;
        this.inputData = inputData;
        this.expectedOutput = expectedOutput;
        this.hidden = hidden;
        this.testOrder = testOrder;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Question getQuestion() { return question; }
    public void setQuestion(Question question) { this.question = question; }

    public String getInputData() { return inputData; }
    public void setInputData(String inputData) { this.inputData = inputData; }

    public String getExpectedOutput() { return expectedOutput; }
    public void setExpectedOutput(String expectedOutput) { this.expectedOutput = expectedOutput; }

    public boolean isHidden() { return hidden; }
    public void setHidden(boolean hidden) { this.hidden = hidden; }

    public int getTestOrder() { return testOrder; }
    public void setTestOrder(int testOrder) { this.testOrder = testOrder; }
}
