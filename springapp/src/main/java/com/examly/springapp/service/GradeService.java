package com.examly.springapp.service;

import com.examly.springapp.model.Assessment;
import com.examly.springapp.model.Grade;
import com.examly.springapp.repository.AssessmentRepository;
import com.examly.springapp.repository.GradeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GradeService {
    @Autowired
    private GradeRepository gradeRepo;
    @Autowired
    private AssessmentRepository assessmentRepo;

    public List<Grade> getGradesByAssessment(Long assessmentId) {
        Assessment assessment = assessmentRepo.findById(assessmentId)
                .orElseThrow(() -> new RuntimeException("Assessment not found"));
        return assessment.getGrades();
    }

    public Grade addGrade(Long assessmentId, Grade grade) {
        Assessment assessment = assessmentRepo.findById(assessmentId)
                .orElseThrow(() -> new RuntimeException("Assessment not found"));
        grade.setAssessment(assessment);
        return gradeRepo.save(grade);
    }
}
