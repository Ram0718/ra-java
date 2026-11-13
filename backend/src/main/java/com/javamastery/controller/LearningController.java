package com.javamastery.controller;

import com.javamastery.dto.ApiResponse;
import com.javamastery.entity.TopicProgress;
import com.javamastery.security.UserPrincipal;
import com.javamastery.service.LearningService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/learning")
public class LearningController {

    private final LearningService learningService;

    public LearningController(LearningService learningService) {
        this.learningService = learningService;
    }

    @GetMapping("/modules")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllModules(
            @AuthenticationPrincipal UserPrincipal principal) {
        UUID userId = (principal != null) ? principal.getId() : null;
        List<Map<String, Object>> modules = learningService.getAllModules(userId);
        return ResponseEntity.ok(ApiResponse.ok(modules));
    }

    @GetMapping("/modules/{slug}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getModuleDetails(
            @PathVariable String slug,
            @AuthenticationPrincipal UserPrincipal principal) {
        UUID userId = (principal != null) ? principal.getId() : null;
        Map<String, Object> details = learningService.getModuleDetails(slug, userId);
        return ResponseEntity.ok(ApiResponse.ok(details));
    }

    @GetMapping("/topics/{slug}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTopicDetails(
            @PathVariable String slug,
            @AuthenticationPrincipal UserPrincipal principal) {
        UUID userId = (principal != null) ? principal.getId() : null;
        Map<String, Object> details = learningService.getTopicDetails(slug, userId);
        return ResponseEntity.ok(ApiResponse.ok(details));
    }

    @PostMapping("/topics/{topicId}/mark-read")
    public ResponseEntity<ApiResponse<TopicProgress>> markMaterialRead(
            @PathVariable Long topicId,
            @AuthenticationPrincipal UserPrincipal principal) {
        TopicProgress progress = learningService.markMaterialRead(topicId, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Material marked as read", progress));
    }

    @PostMapping("/topics/{topicId}/track-time")
    public ResponseEntity<ApiResponse<TopicProgress>> trackTimeSpent(
            @PathVariable Long topicId,
            @RequestParam(defaultValue = "60") int seconds,
            @AuthenticationPrincipal UserPrincipal principal) {
        TopicProgress progress = learningService.trackTimeSpent(topicId, principal.getId(), seconds);
        return ResponseEntity.ok(ApiResponse.ok("Reading time logged", progress));
    }
}
