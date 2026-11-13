package com.javamastery.repository;

import com.javamastery.entity.StudentActivity;
import com.javamastery.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StudentActivityRepository extends JpaRepository<StudentActivity, Long> {
    List<StudentActivity> findByUserOrderByCreatedAtDesc(User user);
    List<StudentActivity> findTop10ByUserOrderByCreatedAtDesc(User user);
    List<StudentActivity> findByUserAndCreatedAtAfter(User user, LocalDateTime after);
}
