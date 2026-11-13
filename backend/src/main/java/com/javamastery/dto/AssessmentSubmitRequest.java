package com.javamastery.dto;

import java.util.Map;

public class AssessmentSubmitRequest {
    // Map questionId -> chosenOptionIndex
    private Map<Long, Integer> answers;

    public AssessmentSubmitRequest() {}

    public AssessmentSubmitRequest(Map<Long, Integer> answers) {
        this.answers = answers;
    }

    public Map<Long, Integer> getAnswers() { return answers; }
    public void setAnswers(Map<Long, Integer> answers) { this.answers = answers; }
}
