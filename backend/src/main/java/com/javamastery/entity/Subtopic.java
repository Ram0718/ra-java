package com.javamastery.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "subtopics", indexes = {
    @Index(name = "idx_subtopic_topic", columnList = "topic_id")
})
public class Subtopic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    @Column(name = "subtopic_order", nullable = false)
    private int subtopicOrder;

    @Column(nullable = false, length = 150)
    private String title;

    @Lob
    @Column(name = "content_markdown", columnDefinition = "TEXT", nullable = false)
    private String contentMarkdown;

    @Column(name = "video_url", length = 300)
    private String videoUrl;

    public Subtopic() {}

    public Subtopic(Topic topic, int subtopicOrder, String title, String contentMarkdown) {
        this.topic = topic;
        this.subtopicOrder = subtopicOrder;
        this.title = title;
        this.contentMarkdown = contentMarkdown;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Topic getTopic() { return topic; }
    public void setTopic(Topic topic) { this.topic = topic; }

    public int getSubtopicOrder() { return subtopicOrder; }
    public void setSubtopicOrder(int subtopicOrder) { this.subtopicOrder = subtopicOrder; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContentMarkdown() { return contentMarkdown; }
    public void setContentMarkdown(String contentMarkdown) { this.contentMarkdown = contentMarkdown; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
}
