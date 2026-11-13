package com.javamastery.service;

import com.javamastery.dto.*;
import com.javamastery.entity.*;
import com.javamastery.exception.BadRequestException;
import com.javamastery.exception.ResourceNotFoundException;
import com.javamastery.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.*;

@Service
public class CompilerService {

    private static final Logger logger = LoggerFactory.getLogger(CompilerService.class);

    private final QuestionRepository questionRepository;
    private final TestCaseRepository testCaseRepository;
    private final SubmissionRepository submissionRepository;
    private final SubmissionResultRepository submissionResultRepository;
    private final QuestionProgressRepository questionProgressRepository;
    private final TopicProgressRepository topicProgressRepository;
    private final UserRepository userRepository;
    private final StudentActivityRepository studentActivityRepository;

    @Value("${app.judge0.sandbox-timeout-seconds:5}")
    private int timeoutSeconds;

    // Concurrency throttle: maximum 4 concurrent compilation/execution jobs to prevent CPU exhaustion
    private final Semaphore compileSemaphore = new Semaphore(4);

    // Strict Security Sandbox Rules: Prohibited APIs & keywords that could interact with host, network, or files
    private static final List<String> RESTRICTED_PATTERNS = List.of(
            "ProcessBuilder",
            "ProcessHandle",
            "Runtime.getRuntime",
            "System.exit",
            "System.getenv",
            "System.getProperties",
            "System.setProperty",
            "System.clearProperty",
            "System.load",
            "System.loadLibrary",
            "java.lang.reflect",
            "sun.misc.Unsafe",
            "jdk.internal",
            "java.nio.file",
            "java.net.",
            "java.rmi.",
            "javax.net.",
            "java.net.http",
            "ClassLoader",
            "SecurityManager",
            "FileInputStream",
            "FileOutputStream",
            "RandomAccessFile",
            "FileReader",
            "FileWriter",
            "new File(",
            "Files.read",
            "Files.write"
    );

    public CompilerService(QuestionRepository questionRepository,
                           TestCaseRepository testCaseRepository,
                           SubmissionRepository submissionRepository,
                           SubmissionResultRepository submissionResultRepository,
                           QuestionProgressRepository questionProgressRepository,
                           TopicProgressRepository topicProgressRepository,
                           UserRepository userRepository,
                           StudentActivityRepository studentActivityRepository) {
        this.questionRepository = questionRepository;
        this.testCaseRepository = testCaseRepository;
        this.submissionRepository = submissionRepository;
        this.submissionResultRepository = submissionResultRepository;
        this.questionProgressRepository = questionProgressRepository;
        this.topicProgressRepository = topicProgressRepository;
        this.userRepository = userRepository;
        this.studentActivityRepository = studentActivityRepository;
    }

    public CodeRunResponse runCustomCode(CodeRunRequest request) {
        if (request.getSourceCode() == null || request.getSourceCode().isBlank()) {
            throw new BadRequestException("Source code cannot be empty");
        }

        String input = request.getCustomInput() != null ? request.getCustomInput() : "";
        ExecutionResult exec = executeJavaCodeIsolated(request.getSourceCode(), input, timeoutSeconds);

        return new CodeRunResponse(
                exec.stdout,
                exec.stderr,
                exec.compileError,
                exec.status,
                exec.executionTimeMs,
                exec.memoryUsedKb
        );
    }

    @Transactional
    public CodeSubmitResponse submitSolution(UUID userId, CodeSubmitRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        List<TestCase> testCases = testCaseRepository.findByQuestionOrderByTestOrderAsc(question);
        if (testCases.isEmpty()) {
            throw new BadRequestException("No test cases configured for this question");
        }

        int passedCount = 0;
        int totalCount = testCases.size();
        String overallStatus = "ACCEPTED";
        int maxExecTime = 0;
        int maxMemory = 1200; // estimated KB

        List<TestCaseResultDto> resultDtos = new ArrayList<>();
        List<SubmissionResult> entityResults = new ArrayList<>();

        for (TestCase tc : testCases) {
            ExecutionResult exec = executeJavaCodeIsolated(request.getSourceCode(), tc.getInputData(), timeoutSeconds);

            if (exec.executionTimeMs > maxExecTime) {
                maxExecTime = exec.executionTimeMs;
            }

            if (!"ACCEPTED".equals(exec.status)) {
                // Compilation error, timeout, or runtime error
                overallStatus = exec.status;
                boolean passed = false;
                resultDtos.add(new TestCaseResultDto(
                        tc.getId(), tc.getTestOrder(), passed, tc.isHidden(),
                        tc.getInputData(), tc.getExpectedOutput(), exec.stdout,
                        exec.compileError != null ? exec.compileError : exec.stderr,
                        exec.executionTimeMs
                ));
                entityResults.add(new SubmissionResult(null, tc, passed, exec.stdout,
                        exec.compileError != null ? exec.compileError : exec.stderr, exec.executionTimeMs));
                break; // Stop on first fatal error
            }

            // Normalize whitespace comparison
            String actual = normalizeOutput(exec.stdout);
            String expected = normalizeOutput(tc.getExpectedOutput());
            boolean passed = actual.equals(expected);

            if (passed) {
                passedCount++;
            } else {
                if ("ACCEPTED".equals(overallStatus)) {
                    overallStatus = "WRONG_ANSWER";
                }
            }

            resultDtos.add(new TestCaseResultDto(
                    tc.getId(), tc.getTestOrder(), passed, tc.isHidden(),
                    tc.getInputData(), tc.getExpectedOutput(), exec.stdout,
                    passed ? null : "Output did not match expected testcase output",
                    exec.executionTimeMs
            ));
            entityResults.add(new SubmissionResult(null, tc, passed, exec.stdout,
                    passed ? null : "Wrong Answer", exec.executionTimeMs));
        }

        // Persist Submission
        Submission submission = new Submission(
                user, question, request.getSourceCode(), overallStatus,
                passedCount, totalCount, maxExecTime, maxMemory
        );
        Submission savedSubmission = submissionRepository.save(submission);

        for (SubmissionResult sr : entityResults) {
            sr.setSubmission(savedSubmission);
            submissionResultRepository.save(sr);
        }

        // Update QuestionProgress
        QuestionProgress qProgress = questionProgressRepository.findByUserAndQuestion(user, question)
                .orElseGet(() -> new QuestionProgress(user, question));

        qProgress.setAttemptsCount(qProgress.getAttemptsCount() + 1);
        boolean newlySolved = false;

        if ("ACCEPTED".equals(overallStatus)) {
            if (!qProgress.isSolved()) {
                qProgress.setSolved(true);
                qProgress.setFirstSolvedAt(LocalDateTime.now());
                newlySolved = true;
            }
            qProgress.setBestSubmission(savedSubmission);
        }
        questionProgressRepository.save(qProgress);

        // Check if all questions in this topic are solved -> update topic progress!
        Topic topic = question.getTopic();
        List<Question> topicQuestions = questionRepository.findByTopic(topic);
        boolean allSolved = true;
        for (Question tq : topicQuestions) {
            Optional<QuestionProgress> qp = questionProgressRepository.findByUserAndQuestion(user, tq);
            if (qp.isEmpty() || !qp.get().isSolved()) {
                allSolved = false;
                break;
            }
        }

        if (allSolved) {
            TopicProgress tp = topicProgressRepository.findByUserAndTopic(user, topic)
                    .orElseGet(() -> new TopicProgress(user, topic));
            tp.setExercisesCompleted(true);
            topicProgressRepository.save(tp);
        }

        // Record Activity
        studentActivityRepository.save(new StudentActivity(user, "CODE_SUBMIT",
                "{\"questionId\":\"" + question.getId() + "\", \"status\":\"" + overallStatus + "\", \"passed\":" + passedCount + ", \"total\":" + totalCount + "}"));

        String message = "ACCEPTED".equals(overallStatus)
                ? "Accepted! All " + totalCount + " test cases passed."
                : "Submission evaluated: " + passedCount + "/" + totalCount + " test cases passed. Status: " + overallStatus;

        return new CodeSubmitResponse(
                savedSubmission.getId(),
                overallStatus,
                passedCount,
                totalCount,
                maxExecTime,
                maxMemory,
                resultDtos,
                "ACCEPTED".equals(overallStatus),
                message
        );
    }

    private String normalizeOutput(String s) {
        if (s == null) return "";
        return s.trim().replaceAll("\\r\\n", "\n").replaceAll("\\r", "\n").replaceAll("[ \\t]+$", "");
    }

    private void validateSourceCodeSecurity(String sourceCode) {
        if (sourceCode == null || sourceCode.isBlank()) {
            throw new BadRequestException("Source code cannot be empty.");
        }
        if (sourceCode.length() > 64000) {
            throw new BadRequestException("Source code exceeds maximum permitted length of 64KB.");
        }

        for (String pattern : RESTRICTED_PATTERNS) {
            if (sourceCode.contains(pattern)) {
                logger.warn("Security Alert: Blocked prohibited API '{}' in user submission", pattern);
                throw new BadRequestException("Security Violation: Access to '" + pattern + "' is forbidden. System execution, file I/O, network sockets, reflection, and process commands are strictly prohibited in the RA-Java sandbox.");
            }
        }
    }

    // Isolated sandbox execution: writes to temp scratch dir, compiles with javac, executes with java in separate subprocess
    private ExecutionResult executeJavaCodeIsolated(String sourceCode, String stdin, int timeoutSec) {
        try {
            validateSourceCodeSecurity(sourceCode);
        } catch (BadRequestException e) {
            return new ExecutionResult("", e.getMessage(), e.getMessage(), "SECURITY_VIOLATION", 0, 0);
        }

        boolean acquired = false;
        Path tempDir = null;
        try {
            acquired = compileSemaphore.tryAcquire(2, TimeUnit.SECONDS);
            if (!acquired) {
                return new ExecutionResult("", "Compiler sandbox is currently at peak capacity. Please wait a moment and try again.", null, "SERVER_BUSY", 0, 0);
            }

            tempDir = Files.createTempDirectory("ra_sandbox_");
            // Determine class name (defaults to Solution)
            String className = "Solution";
            if (sourceCode.contains("public class ")) {
                int idx = sourceCode.indexOf("public class ") + 13;
                int end = idx;
                while (end < sourceCode.length() && Character.isJavaIdentifierPart(sourceCode.charAt(end))) {
                    end++;
                }
                className = sourceCode.substring(idx, end).trim();
            }

            Path javaFile = tempDir.resolve(className + ".java");
            Files.writeString(javaFile, sourceCode);

            // Step 1: Compile
            long startTime = System.currentTimeMillis();
            ProcessBuilder compilePb = new ProcessBuilder("javac", javaFile.toString());
            compilePb.directory(tempDir.toFile());
            Process compileProcess = compilePb.start();

            boolean compiled = compileProcess.waitFor(timeoutSec, TimeUnit.SECONDS);
            if (!compiled) {
                compileProcess.destroyForcibly();
                return new ExecutionResult("", "", "Compilation timed out", "COMPILATION_ERROR", timeoutSec * 1000, 0);
            }

            if (compileProcess.exitValue() != 0) {
                String compileErr = readStream(compileProcess.getErrorStream());
                return new ExecutionResult("", compileErr, compileErr, "COMPILATION_ERROR", (int)(System.currentTimeMillis() - startTime), 0);
            }

            // Step 2: Run in isolated JVM subprocess with strict resource constraints
            ProcessBuilder runPb = new ProcessBuilder(
                    "java",
                    "-Xmx128m",
                    "-Xms16m",
                    "-XX:+UseSerialGC",
                    "-XX:ActiveProcessorCount=1",
                    "-Djava.net.useSystemProxies=false",
                    "-Dfile.encoding=UTF-8",
                    "-cp",
                    tempDir.toAbsolutePath().toString(),
                    className
            );
            runPb.directory(tempDir.toFile());
            Process runProcess = runPb.start();

            // Feed stdin
            if (stdin != null && !stdin.isEmpty()) {
                try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(runProcess.getOutputStream()))) {
                    writer.write(stdin);
                    writer.flush();
                }
            } else {
                runProcess.getOutputStream().close();
            }

            boolean finished = runProcess.waitFor(timeoutSec, TimeUnit.SECONDS);
            int execTime = (int) (System.currentTimeMillis() - startTime);

            if (!finished) {
                try {
                    runProcess.descendants().forEach(ProcessHandle::destroyForcibly);
                } catch (Exception ignored) {}
                runProcess.destroyForcibly();
                return new ExecutionResult("", "Time Limit Exceeded", null, "TIME_LIMIT_EXCEEDED", timeoutSec * 1000, 128000);
            }

            String stdout = readStream(runProcess.getInputStream());
            String stderr = readStream(runProcess.getErrorStream());

            if (runProcess.exitValue() != 0) {
                return new ExecutionResult(stdout, stderr, null, "RUNTIME_ERROR", execTime, 64000);
            }

            return new ExecutionResult(stdout, stderr, null, "ACCEPTED", execTime, 48000);

        } catch (Exception e) {
            logger.error("Execution failed: {}", e.getMessage());
            return new ExecutionResult("", e.getMessage(), null, "RUNTIME_ERROR", 0, 0);
        } finally {
            if (acquired) {
                compileSemaphore.release();
            }
            if (tempDir != null) {
                try {
                    deleteDirectory(tempDir.toFile());
                } catch (Exception ignored) {}
            }
        }
    }

    private String readStream(InputStream is) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(is))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (sb.length() > 65536) { // 64KB output limit
                    sb.append("\n...[output truncated]");
                    break;
                }
                sb.append(line).append("\n");
            }
        }
        return sb.toString().trim();
    }

    private void deleteDirectory(File dir) {
        File[] files = dir.listFiles();
        if (files != null) {
            for (File f : files) {
                if (f.isDirectory()) deleteDirectory(f);
                else f.delete();
            }
        }
        dir.delete();
    }

    private static class ExecutionResult {
        String stdout;
        String stderr;
        String compileError;
        String status;
        int executionTimeMs;
        int memoryUsedKb;

        ExecutionResult(String stdout, String stderr, String compileError, String status, int time, int mem) {
            this.stdout = stdout;
            this.stderr = stderr;
            this.compileError = compileError;
            this.status = status;
            this.executionTimeMs = time;
            this.memoryUsedKb = mem;
        }
    }
}
