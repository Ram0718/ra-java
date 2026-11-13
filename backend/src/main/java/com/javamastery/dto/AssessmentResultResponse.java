package com.javamastery.dto;

import java.util.List;
import java.util.UUID;

public class AssessmentResultResponse {
    private UUID attemptId;
    private int score;
    private int passingScore;
    private boolean passed;
    private int totalQuestions;
    private int correctAnswers;
    private List<AssessmentReviewItemDto> reviewItems;

    public AssessmentResultResponse() {}

    public AssessmentResultResponse(UUID attemptId, int score, int passingScore, boolean passed,
                                    int totalQuestions, int correctAnswers, List<AssessmentReviewItemDto> reviewItems) {
        this.attemptId = attemptId;
        this.score = score;
        this.passingScore = passingScore;
        this.passed = passed;
        this.totalQuestions = totalQuestions;
        this.correctAnswers = correctAnswers;
        this.reviewItems = reviewItems;
    }

    public static class AssessmentReviewItemDto {
        private Long questionId;
        private String questionText;
        private String codeSnippet;
        private List<String> options;
        private int selectedOptionIndex;
        private int correctOptionIndex;
        private boolean isCorrect;
        private String explanation;

        public AssessmentReviewItemDto() {}

        public AssessmentReviewItemDto(Long questionId, String questionText, String codeSnippet,
                                      List<String> options, int selectedOptionIndex, int correctOptionIndex,
                                      boolean isCorrect, String explanation) {
            this.questionId = questionId;
            this.questionText = questionText;
            this.codeSnippet = codeSnippet;
            this.options = options;
            this.selectedOptionIndex = selectedOptionIndex;
            this.correctOptionIndex = correctOptionIndex;
            this.isCorrect = isCorrect;
            this.explanation = explanation;
        }

        public Long getQuestionId() { return questionId; }
        public void setQuestionId(Long questionId) { this.questionId = questionId; }

        public String getQuestionText() { return questionText; }
        public void setQuestionText(String questionText) { this.questionText = questionText; }

        public String getCodeSnippet() { return codeSnippet; }
        public void setCodeSnippet(String codeSnippet) { this.codeSnippet = codeSnippet; }

        public List<String> getOptions() { return options; }
        public void setOptions(List<String> options) { this.options = options; }

        public int getSelectedOptionIndex() { return selectedOptionIndex; }
        public void setSelectedOptionIndex(int selectedOptionIndex) { this.selectedOptionIndex = selectedOptionIndex; }

        public int getCorrectOptionIndex() { return correctOptionIndex; }
        public void setCorrectOptionIndex(int correctOptionIndex) { this.correctOptionIndex = correctOptionIndex; }

        public boolean isCorrect() { return isCorrect; }
        public void setCorrect(boolean correct) { isCorrect = correct; }

        public String getExplanation() { return explanation; }
        public void setExplanation(String explanation) { this.explanation = explanation; }
    }

    public UUID getAttemptId() { return attemptId; }
    public void setAttemptId(UUID attemptId) { this.attemptId = attemptId; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public int getPassingScore() { return passingScore; }
    public void setPassingScore(int passingScore) { this.passingScore = passingScore; }

    public boolean isPassed() { return passed; }
    public void setPassed(boolean passed) { this.passed = passed; }

    public int getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(int totalQuestions) { this.totalQuestions = totalQuestions; }

    public int getCorrectAnswers() { return correctAnswers; }
    public void setCorrectAnswers(int correctAnswers) { this.correctAnswers = correctAnswers; }

    public List<AssessmentReviewItemDto> getReviewItems() { return reviewItems; }
    public void setReviewItems(List<AssessmentReviewItemDto> reviewItems) { this.reviewItems = reviewItems; }
}
