package com.examly.springapp.controller;

import com.examly.springapp.model.Grade;
import com.examly.springapp.service.GradeService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(
    origins = {
        "http://localhost:3000",
        "http://localhost:8081",
        "https://learning-management-system-cn9j.onrender.com"
    }
)
@RestController
@RequestMapping("/api/assessments/{assessmentId}/grades")
public class GradeController {

    private final GradeService service;

    public GradeController(GradeService service) {
        this.service = service;
    }

    @GetMapping
    public List<Grade> getGrades(@PathVariable Long assessmentId) {
        return service.getGradesByAssessment(assessmentId);
    }

    @PostMapping
    public Grade addGrade(@PathVariable Long assessmentId, @RequestBody Grade grade) {
        return service.addGrade(assessmentId, grade);
    }
}
