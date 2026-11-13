package com.javamastery.repository;

import com.javamastery.entity.CourseModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseModuleRepository extends JpaRepository<CourseModule, Long> {
    List<CourseModule> findAllByOrderByModuleOrderAsc();
    List<CourseModule> findByPublishedTrueOrderByModuleOrderAsc();
    Optional<CourseModule> findBySlug(String slug);
}
