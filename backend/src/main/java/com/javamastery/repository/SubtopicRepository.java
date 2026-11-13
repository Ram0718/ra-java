package com.javamastery.repository;

import com.javamastery.entity.Subtopic;
import com.javamastery.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubtopicRepository extends JpaRepository<Subtopic, Long> {
    List<Subtopic> findByTopicOrderBySubtopicOrderAsc(Topic topic);
}
