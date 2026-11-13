package com.javamastery.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "topics", indexes = {
    @Index(name = "idx_topic_module", columnList = "module_id"),
    @Index(name = "idx_topic_slug", columnList = "slug")
})
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "module_id", nullable = false)
    private CourseModule module;

    @Column(name = "topic_order", nullable = false)
    private int topicOrder;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, unique = true, length = 150)
    private String slug;

    @Column(name = "estimated_minutes", nullable = false)
    private int estimatedMinutes = 30;

    @Column(name = "is_published", nullable = false)
    private boolean published = true;

    @OneToMany(mappedBy = "topic", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("subtopicOrder ASC")
    private List<Subtopic> subtopics = new ArrayList<>();

    @OneToMany(mappedBy = "topic", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<LearningMaterial> learningMaterials = new ArrayList<>();

    @OneToMany(mappedBy = "topic", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Question> questions = new ArrayList<>();

    public Topic() {}

    public Topic(CourseModule module, int topicOrder, String title, String slug, int estimatedMinutes) {
        this.module = module;
        this.topicOrder = topicOrder;
        this.title = title;
        this.slug = slug;
        this.estimatedMinutes = estimatedMinutes;
        this.published = true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public CourseModule getModule() { return module; }
    public void setModule(CourseModule module) { this.module = module; }

    public int getTopicOrder() { return topicOrder; }
    public void setTopicOrder(int topicOrder) { this.topicOrder = topicOrder; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public int getEstimatedMinutes() { return estimatedMinutes; }
    public void setEstimatedMinutes(int estimatedMinutes) { this.estimatedMinutes = estimatedMinutes; }

    public boolean isPublished() { return published; }
    public void setPublished(boolean published) { this.published = published; }

    public List<Subtopic> getSubtopics() { return subtopics; }
    public void setSubtopics(List<Subtopic> subtopics) { this.subtopics = subtopics; }

    public List<LearningMaterial> getLearningMaterials() { return learningMaterials; }
    public void setLearningMaterials(List<LearningMaterial> learningMaterials) { this.learningMaterials = learningMaterials; }

    public List<Question> getQuestions() { return questions; }
    public void setQuestions(List<Question> questions) { this.questions = questions; }
}
