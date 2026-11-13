package com.javamastery.repository;

import com.javamastery.entity.LearningMaterial;
import com.javamastery.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LearningMaterialRepository extends JpaRepository<LearningMaterial, Long> {
    List<LearningMaterial> findByTopic(Topic topic);
    List<LearningMaterial> findAllByOrderByUploadedAtDesc();
    Optional<LearningMaterial> findFirstByTopicOrderByVersionDesc(Topic topic);
}
