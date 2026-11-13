package com.javamastery.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "questions", indexes = {
    @Index(name = "idx_question_topic", columnList = "topic_id"),
    @Index(name = "idx_question_slug", columnList = "slug"),
    @Index(name = "idx_question_diff", columnList = "difficulty")
})
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    @Column(nullable = false, length = 20)
    private String difficulty; // EASY, MEDIUM, HARD

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, unique = true, length = 200)
    private String slug;

    @Lob
    @Column(name = "problem_statement", columnDefinition = "TEXT", nullable = false)
    private String problemStatement;

    @Lob
    @Column(name = "input_format", columnDefinition = "TEXT", nullable = false)
    private String inputFormat;

    @Lob
    @Column(name = "output_format", columnDefinition = "TEXT", nullable = false)
    private String outputFormat;

    @Lob
    @Column(columnDefinition = "TEXT", nullable = false)
    private String constraints;

    @Column(name = "expected_time_complexity", length = 50)
    private String expectedTimeComplexity;

    @Column(name = "expected_space_complexity", length = 50)
    private String expectedSpaceComplexity;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String hints;

    @Lob
    @Column(name = "editorial_solution", columnDefinition = "TEXT")
    private String editorialSolution;

    @Column(name = "is_published", nullable = false)
    private boolean published = true;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("testOrder ASC")
    private List<TestCase> testCases = new ArrayList<>();

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<CodeTemplate> codeTemplates = new ArrayList<>();

    public Question() {}

    public Question(Topic topic, String difficulty, String title, String slug, String problemStatement,
                    String inputFormat, String outputFormat, String constraints) {
        this.topic = topic;
        this.difficulty = difficulty;
        this.title = title;
        this.slug = slug;
        this.problemStatement = problemStatement;
        this.inputFormat = inputFormat;
        this.outputFormat = outputFormat;
        this.constraints = constraints;
        this.published = true;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Topic getTopic() { return topic; }
    public void setTopic(Topic topic) { this.topic = topic; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getProblemStatement() { return problemStatement; }
    public void setProblemStatement(String problemStatement) { this.problemStatement = problemStatement; }

    public String getInputFormat() { return inputFormat; }
    public void setInputFormat(String inputFormat) { this.inputFormat = inputFormat; }

    public String getOutputFormat() { return outputFormat; }
    public void setOutputFormat(String outputFormat) { this.outputFormat = outputFormat; }

    public String getConstraints() { return constraints; }
    public void setConstraints(String constraints) { this.constraints = constraints; }

    public String getExpectedTimeComplexity() { return expectedTimeComplexity; }
    public void setExpectedTimeComplexity(String expectedTimeComplexity) { this.expectedTimeComplexity = expectedTimeComplexity; }

    public String getExpectedSpaceComplexity() { return expectedSpaceComplexity; }
    public void setExpectedSpaceComplexity(String expectedSpaceComplexity) { this.expectedSpaceComplexity = expectedSpaceComplexity; }

    public String getHints() { return hints; }
    public void setHints(String hints) { this.hints = hints; }

    public String getEditorialSolution() { return editorialSolution; }
    public void setEditorialSolution(String editorialSolution) { this.editorialSolution = editorialSolution; }

    public boolean isPublished() { return published; }
    public void setPublished(boolean published) { this.published = published; }

    public List<TestCase> getTestCases() { return testCases; }
    public void setTestCases(List<TestCase> testCases) { this.testCases = testCases; }

    public List<CodeTemplate> getCodeTemplates() { return codeTemplates; }
    public void setCodeTemplates(List<CodeTemplate> codeTemplates) { this.codeTemplates = codeTemplates; }
}
