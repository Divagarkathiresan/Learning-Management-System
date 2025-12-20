package com.examly.springapp.repository;

import com.examly.springapp.model.CourseModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseModuleRepository extends JpaRepository<CourseModule, Long> {
    
}
