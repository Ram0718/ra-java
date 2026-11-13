package com.javamastery.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "assessment_questions", indexes = {
    @Index(name = "idx_asmt_q_assessment", columnList = "assessment_id")
})
public class AssessmentQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assessment_id", nullable = false)
    private Assessment assessment;

    @Column(name = "question_type", nullable = false, length = 30)
    private String questionType = "MCQ"; // MCQ, OUTPUT_PREDICTION, FIND_ERROR, CODING

    @Lob
    @Column(name = "question_text", columnDefinition = "TEXT", nullable = false)
    private String questionText;

    @Lob
    @Column(name = "code_snippet", columnDefinition = "TEXT")
    private String codeSnippet;

    @Lob
    @Column(name = "options_json", columnDefinition = "TEXT", nullable = false)
    private String optionsJson; // JSON array of string options: ["A", "B", "C", "D"]

    @Column(name = "correct_option_index", nullable = false)
    private int correctOptionIndex;

    @Lob
    @Column(columnDefinition = "TEXT", nullable = false)
    private String explanation;

    public AssessmentQuestion() {}

    public AssessmentQuestion(Assessment assessment, String questionType, String questionText,
                              String codeSnippet, String optionsJson, int correctOptionIndex, String explanation) {
        this.assessment = assessment;
        this.questionType = questionType;
        this.questionText = questionText;
        this.codeSnippet = codeSnippet;
        this.optionsJson = optionsJson;
        this.correctOptionIndex = correctOptionIndex;
        this.explanation = explanation;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Assessment getAssessment() { return assessment; }
    public void setAssessment(Assessment assessment) { this.assessment = assessment; }

    public String getQuestionType() { return questionType; }
    public void setQuestionType(String questionType) { this.questionType = questionType; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public String getCodeSnippet() { return codeSnippet; }
    public void setCodeSnippet(String codeSnippet) { this.codeSnippet = codeSnippet; }

    public String getOptionsJson() { return optionsJson; }
    public void setOptionsJson(String optionsJson) { this.optionsJson = optionsJson; }

    public int getCorrectOptionIndex() { return correctOptionIndex; }
    public void setCorrectOptionIndex(int correctOptionIndex) { this.correctOptionIndex = correctOptionIndex; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
}
