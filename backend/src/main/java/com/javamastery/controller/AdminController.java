package com.javamastery.controller;

import com.javamastery.dto.ApiResponse;
import com.javamastery.entity.LearningMaterial;
import com.javamastery.entity.Question;
import com.javamastery.entity.TestCase;
import com.javamastery.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics() {
        Map<String, Object> analytics = adminService.getAdminAnalytics();
        return ResponseEntity.ok(ApiResponse.ok(analytics));
    }

    @GetMapping("/students")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getStudents() {
        List<Map<String, Object>> students = adminService.getStudentsList();
        return ResponseEntity.ok(ApiResponse.ok(students));
    }

    @PostMapping("/students/{userId}/toggle-status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> toggleStudentStatus(@PathVariable UUID userId) {
        boolean active = adminService.toggleStudentStatus(userId);
        return ResponseEntity.ok(ApiResponse.ok("Status updated", Map.of("active", active)));
    }

    public static class CreateQuestionRequest {
        public Long topicId;
        public String title;
        public String slug;
        public String difficulty;
        public String problemStatement;
        public String inputFormat;
        public String outputFormat;
        public String constraints;
        public String expectedTimeComplexity;
        public String expectedSpaceComplexity;
        public String hints;
        public String editorialSolution;
        public String starterCode;
        public List<TestCaseItem> testCases;

        public static class TestCaseItem {
            public String inputData;
            public String expectedOutput;
            public boolean hidden;
        }
    }

    @PostMapping("/questions")
    public ResponseEntity<ApiResponse<Question>> createQuestion(@RequestBody CreateQuestionRequest request) {
        Question q = new Question();
        q.setTitle(request.title);
        q.setSlug(request.slug);
        q.setDifficulty(request.difficulty);
        q.setProblemStatement(request.problemStatement);
        q.setInputFormat(request.inputFormat);
        q.setOutputFormat(request.outputFormat);
        q.setConstraints(request.constraints);
        q.setExpectedTimeComplexity(request.expectedTimeComplexity);
        q.setExpectedSpaceComplexity(request.expectedSpaceComplexity);
        q.setHints(request.hints);
        q.setEditorialSolution(request.editorialSolution);

        List<TestCase> testCases = null;
        if (request.testCases != null) {
            testCases = request.testCases.stream().map(ti -> {
                TestCase tc = new TestCase();
                tc.setInputData(ti.inputData);
                tc.setExpectedOutput(ti.expectedOutput);
                tc.setHidden(ti.hidden);
                return tc;
            }).toList();
        }

        Question created = adminService.createQuestion(request.topicId, q, testCases, request.starterCode);
        return ResponseEntity.ok(ApiResponse.ok("Question published", created));
    }

    public static class UploadMaterialRequest {
        public Long topicId;
        public String title;
        public String pdfUrl;
        public long fileSizeBytes;
    }

    @PostMapping("/materials")
    public ResponseEntity<ApiResponse<LearningMaterial>> uploadMaterial(@RequestBody UploadMaterialRequest request) {
        LearningMaterial lm = adminService.uploadMaterial(request.topicId, request.title, request.pdfUrl, request.fileSizeBytes);
        return ResponseEntity.ok(ApiResponse.ok("Study material uploaded", lm));
    }
}
