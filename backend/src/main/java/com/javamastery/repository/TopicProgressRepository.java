package com.javamastery.repository;

import com.javamastery.entity.Topic;
import com.javamastery.entity.TopicProgress;
import com.javamastery.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TopicProgressRepository extends JpaRepository<TopicProgress, Long> {

    Optional<TopicProgress> findByUserAndTopic(User user, Topic topic);

    List<TopicProgress> findByUser(User user);

    long countByUserAndStatus(User user, String status);

    long countByTopicAndStatus(Topic topic, String status);

    @Query("SELECT tp FROM TopicProgress tp WHERE tp.user.id = :userId AND tp.topic.id = :topicId")
    Optional<TopicProgress> findByUserIdAndTopicId(@Param("userId") java.util.UUID userId, @Param("topicId") Long topicId);
}
