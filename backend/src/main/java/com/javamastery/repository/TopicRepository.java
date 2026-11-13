package com.javamastery.repository;

import com.javamastery.entity.CourseModule;
import com.javamastery.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {
    List<Topic> findByModuleOrderByTopicOrderAsc(CourseModule module);
    List<Topic> findByModuleAndPublishedTrueOrderByTopicOrderAsc(CourseModule module);
    List<Topic> findByPublishedTrueOrderByModule_ModuleOrderAscTopicOrderAsc();
    Optional<Topic> findBySlug(String slug);
    long countByPublishedTrue();
}
