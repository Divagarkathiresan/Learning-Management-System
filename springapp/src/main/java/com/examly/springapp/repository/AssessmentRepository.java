package com.examly.springapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.examly.springapp.model.Assessment;

public interface AssessmentRepository extends JpaRepository<Assessment,Long>{

}
