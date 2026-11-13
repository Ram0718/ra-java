package com.javamastery.repository;

import com.javamastery.entity.Question;
import com.javamastery.entity.QuestionProgress;
import com.javamastery.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface QuestionProgressRepository extends JpaRepository<QuestionProgress, Long> {

    Optional<QuestionProgress> findByUserAndQuestion(User user, Question question);

    List<QuestionProgress> findByUser(User user);

    long countByUserAndSolvedTrue(User user);

    long countByQuestionAndSolvedTrue(Question question);

    @Query("SELECT qp FROM QuestionProgress qp WHERE qp.user.id = :userId AND qp.question.id = :questionId")
    Optional<QuestionProgress> findByUserIdAndQuestionId(@Param("userId") UUID userId, @Param("questionId") UUID questionId);
}
