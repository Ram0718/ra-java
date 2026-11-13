package com.javamastery.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "submission_results", indexes = {
    @Index(name = "idx_result_submission", columnList = "submission_id")
})
public class SubmissionResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "submission_id", nullable = false)
    private Submission submission;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "test_case_id", nullable = false)
    private TestCase testCase;

    @Column(nullable = false)
    private boolean passed;

    @Lob
    @Column(name = "actual_output", columnDefinition = "TEXT")
    private String actualOutput;

    @Lob
    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "execution_time_ms")
    private Integer executionTimeMs;

    public SubmissionResult() {}

    public SubmissionResult(Submission submission, TestCase testCase, boolean passed,
                            String actualOutput, String errorMessage, Integer executionTimeMs) {
        this.submission = submission;
        this.testCase = testCase;
        this.passed = passed;
        this.actualOutput = actualOutput;
        this.errorMessage = errorMessage;
        this.executionTimeMs = executionTimeMs;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Submission getSubmission() { return submission; }
    public void setSubmission(Submission submission) { this.submission = submission; }

    public TestCase getTestCase() { return testCase; }
    public void setTestCase(TestCase testCase) { this.testCase = testCase; }

    public boolean isPassed() { return passed; }
    public void setPassed(boolean passed) { this.passed = passed; }

    public String getActualOutput() { return actualOutput; }
    public void setActualOutput(String actualOutput) { this.actualOutput = actualOutput; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public Integer getExecutionTimeMs() { return executionTimeMs; }
    public void setExecutionTimeMs(Integer executionTimeMs) { this.executionTimeMs = executionTimeMs; }
}
