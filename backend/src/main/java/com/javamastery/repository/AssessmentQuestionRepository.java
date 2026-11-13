package com.javamastery.repository;

import com.javamastery.entity.Assessment;
import com.javamastery.entity.AssessmentQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentQuestionRepository extends JpaRepository<AssessmentQuestion, Long> {
    List<AssessmentQuestion> findByAssessmentOrderByIdAsc(Assessment assessment);
}
