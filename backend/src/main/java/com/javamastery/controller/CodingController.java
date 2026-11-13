package com.javamastery.controller;

import com.javamastery.dto.*;
import com.javamastery.entity.*;
import com.javamastery.exception.PaymentRequiredException;
import com.javamastery.exception.ResourceNotFoundException;
import com.javamastery.repository.*;
import com.javamastery.security.UserPrincipal;
import com.javamastery.service.CompilerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/coding")
@Transactional(readOnly = true)
public class CodingController {

    private final CompilerService compilerService;
    private final QuestionRepository questionRepository;
    private final TopicRepository topicRepository;
    private final TestCaseRepository testCaseRepository;
    private final CodeTemplateRepository codeTemplateRepository;
    private final QuestionProgressRepository questionProgressRepository;
    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;

    public CodingController(CompilerService compilerService,
                            QuestionRepository questionRepository,
                            TopicRepository topicRepository,
                            TestCaseRepository testCaseRepository,
                            CodeTemplateRepository codeTemplateRepository,
                            QuestionProgressRepository questionProgressRepository,
                            SubmissionRepository submissionRepository,
                            UserRepository userRepository) {
        this.compilerService = compilerService;
        this.questionRepository = questionRepository;
        this.topicRepository = topicRepository;
        this.testCaseRepository = testCaseRepository;
        this.codeTemplateRepository = codeTemplateRepository;
        this.questionProgressRepository = questionProgressRepository;
        this.submissionRepository = submissionRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/topics/{topicId}/questions")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getTopicQuestions(
            @PathVariable Long topicId,
            @AuthenticationPrincipal UserPrincipal principal) {

        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found"));

        List<Question> questions = questionRepository.findByTopicAndPublishedTrue(topic);
        User user = (principal != null) ? userRepository.findById(principal.getId()).orElse(null) : null;

        Map<UUID, Boolean> solvedMap = new HashMap<>();
        if (user != null) {
            for (QuestionProgress qp : questionProgressRepository.findByUser(user)) {
                solvedMap.put(qp.getQuestion().getId(), qp.isSolved());
            }
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (Question q : questions) {
            Map<String, Object> qm = new HashMap<>();
            qm.put("id", q.getId());
            qm.put("title", q.getTitle());
            qm.put("slug", q.getSlug());
            qm.put("difficulty", q.getDifficulty());
            qm.put("expectedTimeComplexity", q.getExpectedTimeComplexity());
            qm.put("expectedSpaceComplexity", q.getExpectedSpaceComplexity());
            qm.put("solved", solvedMap.getOrDefault(q.getId(), false));
            result.add(qm);
        }

        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/questions/{slug}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getQuestionDetails(
            @PathVariable String slug,
            @AuthenticationPrincipal UserPrincipal principal) {

        Question question = questionRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with slug: " + slug));

        // Get public sample test cases ONLY (never hidden)
        List<TestCase> sampleTestCases = testCaseRepository.findByQuestionAndHiddenFalseOrderByTestOrderAsc(question);
        Optional<CodeTemplate> templateOpt = codeTemplateRepository.findFirstByQuestion(question);

        User user = (principal != null) ? userRepository.findById(principal.getId()).orElse(null) : null;
        boolean solved = false;
        if (user != null) {
            Optional<QuestionProgress> qp = questionProgressRepository.findByUserAndQuestion(user, question);
            solved = qp.isPresent() && qp.get().isSolved();
        }

        List<Map<String, Object>> sampleCasesDto = new ArrayList<>();
        for (TestCase tc : sampleTestCases) {
            Map<String, Object> tcMap = new HashMap<>();
            tcMap.put("id", tc.getId());
            tcMap.put("inputData", tc.getInputData());
            tcMap.put("expectedOutput", tc.getExpectedOutput());
            tcMap.put("testOrder", tc.getTestOrder());
            sampleCasesDto.add(tcMap);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("id", question.getId());
        result.put("title", question.getTitle());
        result.put("slug", question.getSlug());
        result.put("difficulty", question.getDifficulty());
        result.put("topicTitle", question.getTopic().getTitle());
        result.put("topicSlug", question.getTopic().getSlug());
        result.put("moduleTitle", question.getTopic().getModule().getTitle());
        result.put("problemStatement", question.getProblemStatement());
        result.put("inputFormat", question.getInputFormat());
        result.put("outputFormat", question.getOutputFormat());
        result.put("constraints", question.getConstraints());
        result.put("expectedTimeComplexity", question.getExpectedTimeComplexity());
        result.put("expectedSpaceComplexity", question.getExpectedSpaceComplexity());
        result.put("hints", question.getHints());
        result.put("solved", solved);
        result.put("sampleTestCases", sampleCasesDto);
        result.put("starterCode", templateOpt.map(CodeTemplate::getStarterCode).orElse("public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}"));

        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @PostMapping("/run")
    public ResponseEntity<ApiResponse<CodeRunResponse>> runCode(@RequestBody CodeRunRequest request) {
        CodeRunResponse response = compilerService.runCustomCode(request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/submit")
    @Transactional
    public ResponseEntity<ApiResponse<CodeSubmitResponse>> submitCode(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody CodeSubmitRequest request) {

        if (principal == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Must be logged in to submit solutions", "UNAUTHORIZED"));
        }

        // All registered students have free access to submit solutions
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CodeSubmitResponse response = compilerService.submitSolution(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/submissions/{questionId}")
    public ResponseEntity<ApiResponse<List<Submission>>> getSubmissionsHistory(
            @PathVariable UUID questionId,
            @AuthenticationPrincipal UserPrincipal principal) {

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        List<Submission> history = submissionRepository.findByUserAndQuestionOrderBySubmittedAtDesc(user, question);
        return ResponseEntity.ok(ApiResponse.ok(history));
    }

    @GetMapping("/questions/{slug}/editorial")
    public ResponseEntity<ApiResponse<Map<String, String>>> getEditorial(
            @PathVariable String slug,
            @AuthenticationPrincipal UserPrincipal principal) {

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Question question = questionRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        Map<String, String> editorial = new HashMap<>();
        editorial.put("editorialSolution", question.getEditorialSolution());
        editorial.put("explanation", "Reference O(" + question.getExpectedTimeComplexity() + ") solution designed for standard testcase compliance.");

        return ResponseEntity.ok(ApiResponse.ok(editorial));
    }
}
