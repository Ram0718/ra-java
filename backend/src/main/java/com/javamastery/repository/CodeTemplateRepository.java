package com.javamastery.repository;

import com.javamastery.entity.CodeTemplate;
import com.javamastery.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CodeTemplateRepository extends JpaRepository<CodeTemplate, Long> {
    Optional<CodeTemplate> findFirstByQuestion(Question question);
}
