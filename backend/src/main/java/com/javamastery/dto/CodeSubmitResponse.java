package com.javamastery.dto;

import java.util.List;
import java.util.UUID;

public class CodeSubmitResponse {
    private UUID submissionId;
    private String status; // ACCEPTED, WRONG_ANSWER, COMPILATION_ERROR, RUNTIME_ERROR, TIME_LIMIT_EXCEEDED, MEMORY_LIMIT_EXCEEDED
    private int passedTestCases;
    private int totalTestCases;
    private Integer executionTimeMs;
    private Integer memoryUsedKb;
    private List<TestCaseResultDto> testCaseResults;
    private boolean solved;
    private String message;

    public CodeSubmitResponse() {}

    public CodeSubmitResponse(UUID submissionId, String status, int passedTestCases,
                              int totalTestCases, Integer executionTimeMs, Integer memoryUsedKb,
                              List<TestCaseResultDto> testCaseResults, boolean solved, String message) {
        this.submissionId = submissionId;
        this.status = status;
        this.passedTestCases = passedTestCases;
        this.totalTestCases = totalTestCases;
        this.executionTimeMs = executionTimeMs;
        this.memoryUsedKb = memoryUsedKb;
        this.testCaseResults = testCaseResults;
        this.solved = solved;
        this.message = message;
    }

    public UUID getSubmissionId() { return submissionId; }
    public void setSubmissionId(UUID submissionId) { this.submissionId = submissionId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getPassedTestCases() { return passedTestCases; }
    public void setPassedTestCases(int passedTestCases) { this.passedTestCases = passedTestCases; }

    public int getTotalTestCases() { return totalTestCases; }
    public void setTotalTestCases(int totalTestCases) { this.totalTestCases = totalTestCases; }

    public Integer getExecutionTimeMs() { return executionTimeMs; }
    public void setExecutionTimeMs(Integer executionTimeMs) { this.executionTimeMs = executionTimeMs; }

    public Integer getMemoryUsedKb() { return memoryUsedKb; }
    public void setMemoryUsedKb(Integer memoryUsedKb) { this.memoryUsedKb = memoryUsedKb; }

    public List<TestCaseResultDto> getTestCaseResults() { return testCaseResults; }
    public void setTestCaseResults(List<TestCaseResultDto> testCaseResults) { this.testCaseResults = testCaseResults; }

    public boolean isSolved() { return solved; }
    public void setSolved(boolean solved) { this.solved = solved; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
