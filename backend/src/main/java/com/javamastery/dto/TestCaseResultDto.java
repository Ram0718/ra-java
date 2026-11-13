package com.javamastery.dto;

public class TestCaseResultDto {
    private Long testCaseId;
    private int testOrder;
    private boolean passed;
    private boolean hidden;
    private String inputData;      // null if hidden
    private String expectedOutput;  // null if hidden
    private String actualOutput;    // null if hidden
    private String errorMessage;
    private Integer executionTimeMs;

    public TestCaseResultDto() {}

    public TestCaseResultDto(Long testCaseId, int testOrder, boolean passed, boolean hidden,
                             String inputData, String expectedOutput, String actualOutput,
                             String errorMessage, Integer executionTimeMs) {
        this.testCaseId = testCaseId;
        this.testOrder = testOrder;
        this.passed = passed;
        this.hidden = hidden;
        this.inputData = hidden ? "[Hidden Test Case]" : inputData;
        this.expectedOutput = hidden ? "[Hidden Test Case]" : expectedOutput;
        this.actualOutput = hidden ? null : actualOutput;
        this.errorMessage = errorMessage;
        this.executionTimeMs = executionTimeMs;
    }

    public Long getTestCaseId() { return testCaseId; }
    public void setTestCaseId(Long testCaseId) { this.testCaseId = testCaseId; }

    public int getTestOrder() { return testOrder; }
    public void setTestOrder(int testOrder) { this.testOrder = testOrder; }

    public boolean isPassed() { return passed; }
    public void setPassed(boolean passed) { this.passed = passed; }

    public boolean isHidden() { return hidden; }
    public void setHidden(boolean hidden) { this.hidden = hidden; }

    public String getInputData() { return inputData; }
    public void setInputData(String inputData) { this.inputData = inputData; }

    public String getExpectedOutput() { return expectedOutput; }
    public void setExpectedOutput(String expectedOutput) { this.expectedOutput = expectedOutput; }

    public String getActualOutput() { return actualOutput; }
    public void setActualOutput(String actualOutput) { this.actualOutput = actualOutput; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public Integer getExecutionTimeMs() { return executionTimeMs; }
    public void setExecutionTimeMs(Integer executionTimeMs) { this.executionTimeMs = executionTimeMs; }
}
