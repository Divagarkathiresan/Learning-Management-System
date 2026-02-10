package com.examly.springapp.service;

import com.examly.springapp.model.Assessment;
import com.examly.springapp.repository.AssessmentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AssessmentService {

    @Autowired
    private AssessmentRepository repo;

    public List<Assessment> getAll() {
        return repo.findAll();
    }

    public Assessment getById(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Assessment not found"));
    }

    public Assessment create(Assessment assessment) {
        return repo.save(assessment);
    }

    public Assessment update(Long id, Assessment updated) {
        Assessment existing = getById(id);
        if (updated.getTitle() != null) {
            existing.setTitle(updated.getTitle());
        }
        if (updated.getDescription() != null) {
            existing.setDescription(updated.getDescription());
        }
        return repo.save(existing);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
