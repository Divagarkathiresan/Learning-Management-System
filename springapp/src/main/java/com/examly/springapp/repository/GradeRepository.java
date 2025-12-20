package com.examly.springapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.examly.springapp.model.Grade;

public interface GradeRepository extends JpaRepository<Grade,Long>{

}
