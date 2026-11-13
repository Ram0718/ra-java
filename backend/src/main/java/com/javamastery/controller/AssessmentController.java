package com.javamastery.controller;

import com.javamastery.dto.ApiResponse;
import com.javamastery.dto.AssessmentResultResponse;
import com.javamastery.dto.AssessmentSubmitRequest;
import com.javamastery.entity.AssessmentAttempt;
import com.javamastery.security.UserPrincipal;
import com.javamastery.service.AssessmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/assessments")
public class AssessmentController {

    private final AssessmentService assessmentService;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @GetMapping("/topic/{topicId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAssessmentByTopic(
            @PathVariable Long topicId,
            @AuthenticationPrincipal UserPrincipal principal) {
        Map<String, Object> assessment = assessmentService.getAssessmentByTopic(topicId, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(assessment));
    }

    @PostMapping("/{assessmentId}/submit")
    public ResponseEntity<ApiResponse<AssessmentResultResponse>> submitAssessment(
            @PathVariable Long assessmentId,
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody AssessmentSubmitRequest request) {
        AssessmentResultResponse result = assessmentService.submitAssessment(principal.getId(), assessmentId, request);
        return ResponseEntity.ok(ApiResponse.ok("Assessment submitted successfully", result));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<AssessmentAttempt>>> getAssessmentHistory(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<AssessmentAttempt> history = assessmentService.getStudentAttempts(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(history));
    }
}
