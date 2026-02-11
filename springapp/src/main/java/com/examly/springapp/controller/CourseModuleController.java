package com.examly.springapp.controller;

import com.examly.springapp.model.CourseModule;
import com.examly.springapp.model.User;
import com.examly.springapp.service.CourseModuleService;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;


@CrossOrigin(
    origins = {
        "http://localhost:3000",
        "http://localhost:8081",
        "https://learning-management-system-cn9j.onrender.com",
        "https://learning-management-system-backend-y1dd.onrender.com"
    }
)

@RestController
@RequestMapping("/api/courses")
public class CourseModuleController {
    
    @Autowired
    private CourseModuleService service;
    
    @Autowired
    private UserRepository userRepo;
    
    @Autowired
    private JwtUtil jwtUtil;

    
    @PostMapping
    public ResponseEntity<?> addCourse(@RequestBody CourseModule course,
                                       @RequestHeader(value = "Authorization", required = false) String token) {
        try {
            if (token == null || token.isBlank()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Missing token"));
            }
            String rawToken = token.startsWith("Bearer ") ? token.substring(7) : token;
            String username = jwtUtil.extractUsername(rawToken);
            User user = userRepo.findByUsername(username);
            
            String email = user == null ? "" : user.getEmail();
            if (user == null || (!"ADMIN".equals(user.getRole()) && !email.toLowerCase().endsWith("@lms.ac.in"))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only admins can add courses"));
            }
            
            return ResponseEntity.ok(service.addCourse(course));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid token"));
        }
    }

    @GetMapping
    public ResponseEntity<List<CourseModule>> getAllCourses() {
        return ResponseEntity.ok(service.getAllCourses());
    }


    @GetMapping("/{id}")
    public ResponseEntity<CourseModule> getCourseById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getCourseById(id));
    }

    @GetMapping("/{id}/content")
    public ResponseEntity<Map<String, String>> getCourseContent(@PathVariable Long id) {
        CourseModule course = service.getCourseById(id);
        Map<String, String> response = new HashMap<>();
        response.put("title", course.getTitle());
        response.put("description", course.getDescription());
        response.put("content", course.getContent());
        return ResponseEntity.ok(response);
    }
    

    @PutMapping("/{id}")
    public ResponseEntity<CourseModule> updateCourse(@PathVariable Long id,@RequestBody CourseModule updatedCourse) {
        return ResponseEntity.ok(service.updateCourse(id, updatedCourse));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCourse(@PathVariable Long id) {
        service.deleteCourse(id);
        return ResponseEntity.ok("Course with "+id+" deleted successfully");
    }
    @DeleteMapping
    public ResponseEntity<String> deleteAllCourses() {
        service.deleteAllCourses();
        return ResponseEntity.ok("All courses deleted successfully");
    }

    @PutMapping("/{id}/enroll")
    public ResponseEntity<CourseModule> enrollStudent(@PathVariable Long id, @RequestParam String student) {
        return ResponseEntity.ok(service.enrollStudent(id, student));
    }
    
    @GetMapping("/{id}/students")
    public ResponseEntity<List<String>> getEnrolledStudents(@PathVariable Long id) {
        return ResponseEntity.ok(service.getEnrolledStudents(id));
    }

    @DeleteMapping("/{courseId}/enroll/{student}")
    public ResponseEntity<CourseModule> removeEnrolledStudent(@PathVariable Long courseId,@PathVariable String student) {
        return ResponseEntity.ok(service.removeEnrolledStudent(courseId, student));
    }


    @PutMapping("/{id}/progress")
    public ResponseEntity<CourseModule> updateProgress(@PathVariable Long id,@RequestParam String student,@RequestParam int progress) {
        return ResponseEntity.ok(service.updateProgress(id, student, progress));
    }

    @GetMapping("/{id}/quiz")
    public ResponseEntity<List<String>> getQuizQuestions(@PathVariable Long id) {
        return ResponseEntity.ok(service.getQuizQuestions(id));
    }

    @PostMapping("/{id}/quiz")
    public ResponseEntity<String> submitQuizScore(@PathVariable Long id,
                                                  @RequestParam String student,
                                                  @RequestParam int score) {
        return ResponseEntity.ok(service.submitScore(id, student, score));
    }
}
