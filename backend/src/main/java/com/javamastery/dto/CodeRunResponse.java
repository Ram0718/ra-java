package com.javamastery.dto;

public class CodeRunResponse {
    private String stdout;
    private String stderr;
    private String compileOutput;
    private String status; // ACCEPTED, COMPILATION_ERROR, RUNTIME_ERROR, TIME_LIMIT_EXCEEDED, MEMORY_LIMIT_EXCEEDED
    private Integer executionTimeMs;
    private Integer memoryUsedKb;

    public CodeRunResponse() {}

    public CodeRunResponse(String stdout, String stderr, String compileOutput, String status,
                           Integer executionTimeMs, Integer memoryUsedKb) {
        this.stdout = stdout;
        this.stderr = stderr;
        this.compileOutput = compileOutput;
        this.status = status;
        this.executionTimeMs = executionTimeMs;
        this.memoryUsedKb = memoryUsedKb;
    }

    public String getStdout() { return stdout; }
    public void setStdout(String stdout) { this.stdout = stdout; }

    public String getStderr() { return stderr; }
    public void setStderr(String stderr) { this.stderr = stderr; }

    public String getCompileOutput() { return compileOutput; }
    public void setCompileOutput(String compileOutput) { this.compileOutput = compileOutput; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getExecutionTimeMs() { return executionTimeMs; }
    public void setExecutionTimeMs(Integer executionTimeMs) { this.executionTimeMs = executionTimeMs; }

    public Integer getMemoryUsedKb() { return memoryUsedKb; }
    public void setMemoryUsedKb(Integer memoryUsedKb) { this.memoryUsedKb = memoryUsedKb; }
}
