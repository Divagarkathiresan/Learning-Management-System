package com.examly.springapp.controller;

import com.examly.springapp.model.Assessment;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.service.AssessmentService;
import com.examly.springapp.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.Map;
import java.util.List;

@CrossOrigin(
    origins = {
        "http://localhost:3000",
        "http://localhost:8081",
        "https://learning-management-system-cn9j.onrender.com",
        "https://learning-management-system-backend-y1dd.onrender.com"
    }
)
@RestController
@RequestMapping("/api/assessments")
public class AssessmentController {
    @Autowired
    private AssessmentService service;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JwtUtil jwtUtil;
    
    @GetMapping
    public List<Assessment> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Assessment getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Assessment assessment,
                                    @RequestHeader(value = "Authorization", required = false) String token) {
        try {
            if (token == null || token.isBlank()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Missing token"));
            }
            String rawToken = token.startsWith("Bearer ") ? token.substring(7) : token;
            String username = jwtUtil.extractUsername(rawToken);
            User user = userRepo.findByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid token"));
            }

            Assessment saved = service.create(assessment);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid token"));
        }
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
