package com.javamastery.controller;

import com.javamastery.dto.ApiResponse;
import com.javamastery.service.InterviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/interview")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @GetMapping("/topics")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getInterviewTopics() {
        List<Map<String, Object>> topics = interviewService.getInterviewTopics();
        return ResponseEntity.ok(ApiResponse.ok(topics));
    }

    @GetMapping("/mock-session")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMockInterviewSession() {
        Map<String, Object> session = interviewService.generateMockInterviewSession();
        return ResponseEntity.ok(ApiResponse.ok(session));
    }
}
