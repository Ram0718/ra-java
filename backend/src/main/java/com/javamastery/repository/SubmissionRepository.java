package com.javamastery.repository;

import com.javamastery.entity.Question;
import com.javamastery.entity.Submission;
import com.javamastery.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, UUID> {
    List<Submission> findByUserOrderBySubmittedAtDesc(User user);
    List<Submission> findByUserAndQuestionOrderBySubmittedAtDesc(User user, Question question);
    long countByUser(User user);
    long countByUserAndStatus(User user, String status);
    long countByStatus(String status);
}
