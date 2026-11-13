package com.javamastery.dto;

import java.util.UUID;

public class CodeSubmitRequest {
    private UUID questionId;
    private String sourceCode;

    public CodeSubmitRequest() {}

    public CodeSubmitRequest(UUID questionId, String sourceCode) {
        this.questionId = questionId;
        this.sourceCode = sourceCode;
    }

    public UUID getQuestionId() { return questionId; }
    public void setQuestionId(UUID questionId) { this.questionId = questionId; }

    public String getSourceCode() { return sourceCode; }
    public void setSourceCode(String sourceCode) { this.sourceCode = sourceCode; }
}
