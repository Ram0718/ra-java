package com.javamastery.repository;

import com.javamastery.entity.Assessment;
import com.javamastery.entity.AssessmentAttempt;
import com.javamastery.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AssessmentAttemptRepository extends JpaRepository<AssessmentAttempt, UUID> {
    List<AssessmentAttempt> findByUserOrderByCompletedAtDesc(User user);
    List<AssessmentAttempt> findByUserAndAssessmentOrderByCompletedAtDesc(User user, Assessment assessment);
    Optional<AssessmentAttempt> findFirstByUserAndAssessmentAndPassedTrue(User user, Assessment assessment);
}
