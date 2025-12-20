package com.examly.springapp.controller;

import com.examly.springapp.model.Assessment;
import com.examly.springapp.service.AssessmentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/assessments")
public class AssessmentController {
    @Autowired
    private AssessmentService service;
    
    @GetMapping
    public List<Assessment> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Assessment getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public Assessment create(@RequestBody Assessment assessment) {
        return service.create(assessment);
    }

    @PutMapping("/{id}")
    public Assessment update(@PathVariable Long id, @RequestBody Assessment assessment) {
        return service.update(id, assessment);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
