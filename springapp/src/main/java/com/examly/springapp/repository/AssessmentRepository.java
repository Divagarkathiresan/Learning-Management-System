package com.examly.springapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.examly.springapp.model.Assessment;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment,Long>{

}
