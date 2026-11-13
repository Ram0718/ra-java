package com.javamastery.dto;

public class CodeRunRequest {
    private String sourceCode;
    private String customInput;

    public CodeRunRequest() {}

    public CodeRunRequest(String sourceCode, String customInput) {
        this.sourceCode = sourceCode;
        this.customInput = customInput;
    }

    public String getSourceCode() { return sourceCode; }
    public void setSourceCode(String sourceCode) { this.sourceCode = sourceCode; }

    public String getCustomInput() { return customInput; }
    public void setCustomInput(String customInput) { this.customInput = customInput; }
}
