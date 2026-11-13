package com.javamastery.service;

import com.javamastery.dto.DashboardStatsDto.ModuleProgressSummaryDto;
import com.javamastery.entity.*;
import com.javamastery.exception.ResourceNotFoundException;
import com.javamastery.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class LearningService {

    private final CourseModuleRepository moduleRepository;
    private final TopicRepository topicRepository;
    private final SubtopicRepository subtopicRepository;
    private final LearningMaterialRepository materialRepository;
    private final TopicProgressRepository topicProgressRepository;
    private final UserRepository userRepository;
    private final StudentActivityRepository studentActivityRepository;

    public LearningService(CourseModuleRepository moduleRepository,
                           TopicRepository topicRepository,
                           SubtopicRepository subtopicRepository,
                           LearningMaterialRepository materialRepository,
                           TopicProgressRepository topicProgressRepository,
                           UserRepository userRepository,
                           StudentActivityRepository studentActivityRepository) {
        this.moduleRepository = moduleRepository;
        this.topicRepository = topicRepository;
        this.subtopicRepository = subtopicRepository;
        this.materialRepository = materialRepository;
        this.topicProgressRepository = topicProgressRepository;
        this.userRepository = userRepository;
        this.studentActivityRepository = studentActivityRepository;
    }

    public List<Map<String, Object>> getAllModules(UUID userId) {
        List<CourseModule> modules = moduleRepository.findByPublishedTrueOrderByModuleOrderAsc();
        List<Map<String, Object>> result = new ArrayList<>();

        User user = (userId != null) ? userRepository.findById(userId).orElse(null) : null;
        Map<Long, String> progressMap = new HashMap<>();

        if (user != null) {
            List<TopicProgress> progresses = topicProgressRepository.findByUser(user);
            for (TopicProgress tp : progresses) {
                progressMap.put(tp.getTopic().getId(), tp.getStatus());
            }
        }

        for (CourseModule m : modules) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", m.getId());
            map.put("moduleOrder", m.getModuleOrder());
            map.put("title", m.getTitle());
            map.put("slug", m.getSlug());
            map.put("description", m.getDescription());
            map.put("iconName", m.getIconName());

            List<Topic> topics = topicRepository.findByModuleAndPublishedTrueOrderByTopicOrderAsc(m);
            map.put("totalTopics", topics.size());

            int completedCount = 0;
            for (Topic t : topics) {
                if ("COMPLETED".equals(progressMap.get(t.getId()))) {
                    completedCount++;
                }
            }
            map.put("completedTopics", completedCount);
            int percentage = topics.isEmpty() ? 0 : (int) Math.round((double) completedCount * 100 / topics.size());
            map.put("completionPercentage", percentage);

            result.add(map);
        }

        return result;
    }

    public Map<String, Object> getModuleDetails(String slug, UUID userId) {
        CourseModule module = moduleRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Module not found with slug: " + slug));

        List<Topic> topics = topicRepository.findByModuleAndPublishedTrueOrderByTopicOrderAsc(module);
        User user = (userId != null) ? userRepository.findById(userId).orElse(null) : null;

        Map<Long, TopicProgress> progressMap = new HashMap<>();
        if (user != null) {
            for (TopicProgress tp : topicProgressRepository.findByUser(user)) {
                progressMap.put(tp.getTopic().getId(), tp);
            }
        }

        List<Map<String, Object>> topicList = new ArrayList<>();
        for (Topic t : topics) {
            Map<String, Object> tm = new HashMap<>();
            tm.put("id", t.getId());
            tm.put("topicOrder", t.getTopicOrder());
            tm.put("title", t.getTitle());
            tm.put("slug", t.getSlug());
            tm.put("estimatedMinutes", t.getEstimatedMinutes());

            TopicProgress tp = progressMap.get(t.getId());
            tm.put("status", tp != null ? tp.getStatus() : "NOT_STARTED");
            tm.put("materialRead", tp != null && tp.isMaterialRead());
            tm.put("exercisesCompleted", tp != null && tp.isExercisesCompleted());
            tm.put("assessmentPassed", tp != null && tp.isAssessmentPassed());
            tm.put("timeSpentSeconds", tp != null ? tp.getTimeSpentSeconds() : 0);

            topicList.add(tm);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("id", module.getId());
        result.put("title", module.getTitle());
        result.put("slug", module.getSlug());
        result.put("description", module.getDescription());
        result.put("moduleOrder", module.getModuleOrder());
        result.put("topics", topicList);
        return result;
    }

    public Map<String, Object> getTopicDetails(String slug, UUID userId) {
        Topic topic = topicRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found: " + slug));

        List<Subtopic> subtopics = subtopicRepository.findByTopicOrderBySubtopicOrderAsc(topic);
        List<LearningMaterial> materials = materialRepository.findByTopic(topic);

        User user = (userId != null) ? userRepository.findById(userId).orElse(null) : null;
        TopicProgress progress = null;
        if (user != null) {
            progress = topicProgressRepository.findByUserAndTopic(user, topic).orElse(null);
            studentActivityRepository.save(new StudentActivity(user, "TOPIC_VIEW",
                    "{\"topicId\":" + topic.getId() + ",\"title\":\"" + topic.getTitle() + "\"}"));
        }

        Map<String, Object> result = new HashMap<>();
        result.put("id", topic.getId());
        result.put("title", topic.getTitle());
        result.put("slug", topic.getSlug());
        result.put("moduleTitle", topic.getModule().getTitle());
        result.put("moduleSlug", topic.getModule().getSlug());
        result.put("estimatedMinutes", topic.getEstimatedMinutes());
        result.put("subtopics", subtopics);
        result.put("materials", materials);

        if (progress != null) {
            result.put("status", progress.getStatus());
            result.put("materialRead", progress.isMaterialRead());
            result.put("exercisesCompleted", progress.isExercisesCompleted());
            result.put("assessmentPassed", progress.isAssessmentPassed());
            result.put("timeSpentSeconds", progress.getTimeSpentSeconds());
        } else {
            result.put("status", "NOT_STARTED");
            result.put("materialRead", false);
            result.put("exercisesCompleted", false);
            result.put("assessmentPassed", false);
            result.put("timeSpentSeconds", 0);
        }

        return result;
    }

    @Transactional
    public TopicProgress markMaterialRead(Long topicId, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found"));

        TopicProgress progress = topicProgressRepository.findByUserAndTopic(user, topic)
                .orElseGet(() -> new TopicProgress(user, topic));

        progress.setMaterialRead(true);
        TopicProgress saved = topicProgressRepository.save(progress);

        studentActivityRepository.save(new StudentActivity(user, "MATERIAL_READ",
                "{\"topicId\":" + topicId + ",\"topicTitle\":\"" + topic.getTitle() + "\"}"));

        return saved;
    }

    @Transactional
    public TopicProgress trackTimeSpent(Long topicId, UUID userId, int additionalSeconds) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found"));

        TopicProgress progress = topicProgressRepository.findByUserAndTopic(user, topic)
                .orElseGet(() -> new TopicProgress(user, topic));

        progress.setTimeSpentSeconds(progress.getTimeSpentSeconds() + Math.max(0, additionalSeconds));
        return topicProgressRepository.save(progress);
    }
}
