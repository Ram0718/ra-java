package com.javamastery.repository;

import com.javamastery.entity.Question;
import com.javamastery.entity.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestCaseRepository extends JpaRepository<TestCase, Long> {
    List<TestCase> findByQuestionOrderByTestOrderAsc(Question question);
    List<TestCase> findByQuestionAndHiddenFalseOrderByTestOrderAsc(Question question);
}
