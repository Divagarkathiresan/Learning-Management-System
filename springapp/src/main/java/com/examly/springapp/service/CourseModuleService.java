package com.examly.springapp.service;

import com.examly.springapp.model.CourseModule;
import com.examly.springapp.repository.CourseModuleRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CourseModuleService {
    
    @Autowired
    private CourseModuleRepository repo;

    public List<CourseModule> getAllCourses() {
        return repo.findAll();
    }

    public CourseModule addCourse(CourseModule course) {
        return repo.save(course);
    }

    public CourseModule getCourseById(Long id) {
        return repo.findById(id)
        .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
    }

    public CourseModule updateCourse(Long id, CourseModule updatedCourse) {
        return repo.findById(id).map(existingCourse -> {
            if(updatedCourse.getTitle()!=null){
                existingCourse.setTitle(updatedCourse.getTitle());
            }
            if(updatedCourse.getDescription()!=null){
                existingCourse.setDescription(updatedCourse.getDescription());
            }
            if(updatedCourse.getContent()!=null){
                existingCourse.setContent(updatedCourse.getContent());
            }
            if(!(updatedCourse.getQuizQuestions().isEmpty())){
                existingCourse.setQuizQuestions(updatedCourse.getQuizQuestions());
            }
            if (!updatedCourse.getEnrolledStudents().isEmpty()) {
                existingCourse.setEnrolledStudents(updatedCourse.getEnrolledStudents());
            }
            if (!updatedCourse.getProgress().isEmpty()) {
                existingCourse.setProgress(updatedCourse.getProgress());
            }
            if (!updatedCourse.getScores().isEmpty()) {
                existingCourse.setScores(updatedCourse.getScores());
            }
            return repo.save(existingCourse);
        }).orElseThrow(() -> new RuntimeException("Course not found with ID: " + id));
    }


    public void deleteCourse(Long id) {
        repo.deleteById(id);
    }

    public void deleteAllCourses() {
        repo.deleteAll();
    }

    public List<String> getEnrolledStudents(Long courseId) {
        CourseModule course = repo.findById(courseId)
        .orElseThrow(() -> new RuntimeException("Course not found with ID: " + courseId));
        return course.getEnrolledStudents();
    }

    public CourseModule enrollStudent(Long id, String student) {
        CourseModule course = repo.findById(id).orElseThrow();
        if (!course.getEnrolledStudents().contains(student)) {
            course.getEnrolledStudents().add(student);
        }
        return repo.save(course);
    }

    public CourseModule removeEnrolledStudent(Long courseId, String student) {
    CourseModule course = repo.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found with ID: " + courseId));
        if (course.getEnrolledStudents().contains(student)) {
            course.getEnrolledStudents().remove(student);
            course.getProgress().remove(student); 
            course.getScores().remove(student);   
        } else {
            throw new RuntimeException("Student not enrolled in this course");
        }

        return repo.save(course);
    }


    public CourseModule updateProgress(Long id, String student, int progressValue) {
        CourseModule course = repo.findById(id).orElseThrow();
        course.getProgress().put(student, progressValue);
        return repo.save(course);
    }

    public List<String> getQuizQuestions(Long id) {
        CourseModule course = repo.findById(id).orElseThrow();
        return course.getQuizQuestions();
    }

    public String submitScore(Long id, String student, int score) {
        CourseModule course = repo.findById(id).orElseThrow();
        course.getScores().put(student, score); // overrides old score if exists
        repo.save(course);
        return "Score submitted!";
    }
}
