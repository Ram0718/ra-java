package com.javamastery.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.javamastery.dto.AssessmentResultResponse;
import com.javamastery.dto.AssessmentResultResponse.AssessmentReviewItemDto;
import com.javamastery.dto.AssessmentSubmitRequest;
import com.javamastery.entity.*;
import com.javamastery.exception.BadRequestException;
import com.javamastery.exception.ResourceNotFoundException;
import com.javamastery.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final AssessmentQuestionRepository questionRepository;
    private final AssessmentAttemptRepository attemptRepository;
    private final TopicRepository topicRepository;
    private final TopicProgressRepository topicProgressRepository;
    private final UserRepository userRepository;
    private final StudentActivityRepository studentActivityRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AssessmentService(AssessmentRepository assessmentRepository,
                             AssessmentQuestionRepository questionRepository,
                             AssessmentAttemptRepository attemptRepository,
                             TopicRepository topicRepository,
                             TopicProgressRepository topicProgressRepository,
                             UserRepository userRepository,
                             StudentActivityRepository studentActivityRepository) {
        this.assessmentRepository = assessmentRepository;
        this.questionRepository = questionRepository;
        this.attemptRepository = attemptRepository;
        this.topicRepository = topicRepository;
        this.topicProgressRepository = topicProgressRepository;
        this.userRepository = userRepository;
        this.studentActivityRepository = studentActivityRepository;
    }

    public Map<String, Object> getAssessmentByTopic(Long topicId, UUID userId) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found"));

        Assessment assessment = assessmentRepository.findByTopic(topic)
                .orElseThrow(() -> new ResourceNotFoundException("No assessment found for topic: " + topic.getTitle()));

        List<AssessmentQuestion> questions = questionRepository.findByAssessmentOrderByIdAsc(assessment);

        // Sanitize questions so correct answers are NOT revealed to student during the test
        List<Map<String, Object>> sanitizedQuestions = new ArrayList<>();
        for (AssessmentQuestion q : questions) {
            Map<String, Object> qm = new HashMap<>();
            qm.put("id", q.getId());
            qm.put("questionType", q.getQuestionType());
            qm.put("questionText", q.getQuestionText());
            qm.put("codeSnippet", q.getCodeSnippet());
            try {
                List<String> options = objectMapper.readValue(q.getOptionsJson(), new TypeReference<List<String>>() {});
                qm.put("options", options);
            } catch (Exception e) {
                qm.put("options", Collections.emptyList());
            }
            sanitizedQuestions.add(qm);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("id", assessment.getId());
        result.put("title", assessment.getTitle());
        result.put("topicTitle", topic.getTitle());
        result.put("topicSlug", topic.getSlug());
        result.put("passingScore", assessment.getPassingScore());
        result.put("timeLimitMinutes", assessment.getTimeLimitMinutes());
        result.put("totalQuestions", questions.size());
        result.put("questions", sanitizedQuestions);

        return result;
    }

    @Transactional
    public AssessmentResultResponse submitAssessment(UUID userId, Long assessmentId, AssessmentSubmitRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment not found"));

        List<AssessmentQuestion> questions = questionRepository.findByAssessmentOrderByIdAsc(assessment);
        if (questions.isEmpty()) {
            throw new BadRequestException("Assessment contains no questions");
        }

        Map<Long, Integer> submittedAnswers = request.getAnswers() != null ? request.getAnswers() : Collections.emptyMap();
        int correctCount = 0;
        List<AssessmentReviewItemDto> reviewItems = new ArrayList<>();

        for (AssessmentQuestion q : questions) {
            Integer selectedIdx = submittedAnswers.get(q.getId());
            int chosen = (selectedIdx != null) ? selectedIdx : -1;
            boolean isCorrect = (chosen == q.getCorrectOptionIndex());

            if (isCorrect) correctCount++;

            List<String> optionsList;
            try {
                optionsList = objectMapper.readValue(q.getOptionsJson(), new TypeReference<List<String>>() {});
            } catch (Exception e) {
                optionsList = Collections.emptyList();
            }

            reviewItems.add(new AssessmentReviewItemDto(
                    q.getId(),
                    q.getQuestionText(),
                    q.getCodeSnippet(),
                    optionsList,
                    chosen,
                    q.getCorrectOptionIndex(),
                    isCorrect,
                    q.getExplanation()
            ));
        }

        int scorePercentage = (int) Math.round((double) correctCount * 100 / questions.size());
        boolean passed = scorePercentage >= assessment.getPassingScore();

        String answersJson;
        try {
            answersJson = objectMapper.writeValueAsString(submittedAnswers);
        } catch (Exception e) {
            answersJson = "{}";
        }

        AssessmentAttempt attempt = new AssessmentAttempt(
                user, assessment, scorePercentage, questions.size(), correctCount, passed, answersJson
        );
        attempt = attemptRepository.save(attempt);

        // Update Topic Progress
        Topic topic = assessment.getTopic();
        TopicProgress tp = topicProgressRepository.findByUserAndTopic(user, topic)
                .orElseGet(() -> new TopicProgress(user, topic));

        if (passed) {
            tp.setAssessmentPassed(true);
            topicProgressRepository.save(tp);

            studentActivityRepository.save(new StudentActivity(user, "ASSESSMENT_PASSED",
                    "{\"topicId\":" + topic.getId() + ",\"score\":" + scorePercentage + "}"));
        }

        return new AssessmentResultResponse(
                attempt.getId(),
                scorePercentage,
                assessment.getPassingScore(),
                passed,
                questions.size(),
                correctCount,
                reviewItems
        );
    }

    public List<AssessmentAttempt> getStudentAttempts(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return attemptRepository.findByUserOrderByCompletedAtDesc(user);
    }
}
