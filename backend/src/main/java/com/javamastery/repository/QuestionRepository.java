package com.javamastery.repository;

import com.javamastery.entity.Question;
import com.javamastery.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface QuestionRepository extends JpaRepository<Question, UUID> {
    List<Question> findByTopicAndPublishedTrue(Topic topic);
    List<Question> findByTopic(Topic topic);
    Optional<Question> findBySlug(String slug);
    long countByPublishedTrue();
    long countByDifficulty(String difficulty);
}
