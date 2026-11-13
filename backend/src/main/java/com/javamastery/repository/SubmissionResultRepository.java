package com.javamastery.repository;

import com.javamastery.entity.Submission;
import com.javamastery.entity.SubmissionResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionResultRepository extends JpaRepository<SubmissionResult, Long> {
    List<SubmissionResult> findBySubmissionOrderByIdAsc(Submission submission);
}
