package com.javamastery.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "learning_materials", indexes = {
    @Index(name = "idx_material_topic", columnList = "topic_id")
})
public class LearningMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(name = "pdf_url", nullable = false, length = 500)
    private String pdfUrl;

    @Column(name = "file_size_bytes", nullable = false)
    private long fileSizeBytes = 0;

    @Column(nullable = false)
    private int version = 1;

    @Column(name = "download_count", nullable = false)
    private long downloadCount = 0;

    @Column(name = "uploaded_at", nullable = false)
    private LocalDateTime uploadedAt = LocalDateTime.now();

    public LearningMaterial() {}

    public LearningMaterial(Topic topic, String title, String pdfUrl, long fileSizeBytes) {
        this.topic = topic;
        this.title = title;
        this.pdfUrl = pdfUrl;
        this.fileSizeBytes = fileSizeBytes;
        this.version = 1;
        this.downloadCount = 0;
        this.uploadedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Topic getTopic() { return topic; }
    public void setTopic(Topic topic) { this.topic = topic; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getPdfUrl() { return pdfUrl; }
    public void setPdfUrl(String pdfUrl) { this.pdfUrl = pdfUrl; }

    public long getFileSizeBytes() { return fileSizeBytes; }
    public void setFileSizeBytes(long fileSizeBytes) { this.fileSizeBytes = fileSizeBytes; }

    public int getVersion() { return version; }
    public void setVersion(int version) { this.version = version; }

    public long getDownloadCount() { return downloadCount; }
    public void setDownloadCount(long downloadCount) { this.downloadCount = downloadCount; }

    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}
