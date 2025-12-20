package com.examly.springapp;



import com.examly.springapp.model.CourseModule;
import com.examly.springapp.repository.CourseModuleRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = SpringappApplication.class)
@AutoConfigureMockMvc
public class SpringappApplicationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CourseModuleRepository repo;

    @Autowired
    private ObjectMapper objectMapper;

    private Long courseId;

    @BeforeEach
    public void setup() {
        repo.deleteAll();
        CourseModule course = new CourseModule();
        course.setTitle("Java Basics");
        course.setDescription("Intro to Java");
        course.setQuizQuestions(Arrays.asList("What is JVM?*Java Virtual Machine", "What is OOP?*Object Oriented Programming"));
        courseId = repo.save(course).getId();
    }

    @Test
    public void SpringBoot_DevelopCoreAPIsAndBusinessLogic_TestAddCourse() throws Exception {
        CourseModule course = new CourseModule();
        course.setTitle("Python");
        course.setDescription("Intro to Python");

        mockMvc.perform(post("/api/courses")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(course)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Python"));
    }

    @Test
    public void SpringBoot_DevelopCoreAPIsAndBusinessLogic_TestGetAllCourses() throws Exception {
        mockMvc.perform(get("/api/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Java Basics"));
    }

    @Test
    public void SpringBoot_DevelopCoreAPIsAndBusinessLogic_TestEnrollStudent() throws Exception {
        mockMvc.perform(put("/api/courses/" + courseId + "/enroll?student=john_doe"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.enrolledStudents[0]").value("john_doe"));
    }

    @Test
    public void SpringBoot_DevelopCoreAPIsAndBusinessLogic_TestUpdateProgress() throws Exception {
        mockMvc.perform(put("/api/courses/" + courseId + "/progress?student=john_doe&progress=60"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.progress.john_doe").value(60));
    }

    @Test
    public void SpringBoot_DevelopCoreAPIsAndBusinessLogic_TestGetQuizQuestions() throws Exception {
        mockMvc.perform(get("/api/courses/" + courseId + "/quiz"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").value("What is JVM?*Java Virtual Machine"));
    }

    @Test
    public void SpringBoot_DevelopCoreAPIsAndBusinessLogic_TestSubmitQuizScore() throws Exception {
        mockMvc.perform(post("/api/courses/" + courseId + "/quiz?student=john_doe&score=80"))
                .andExpect(status().isOk())
                .andExpect(content().string("Score submitted!"));
    }

    @Test
    public void SpringBoot_DatabaseAndSchemaSetup_TestEnrollSameStudentTwice() throws Exception {
        mockMvc.perform(put("/api/courses/" + courseId + "/enroll?student=john_doe"));
        mockMvc.perform(put("/api/courses/" + courseId + "/enroll?student=john_doe"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.enrolledStudents.length()").value(1));
    }

    @Test
    public void SpringBoot_DevelopCoreAPIsAndBusinessLogic_TestEmptyCourseListAfterDelete() throws Exception {
        repo.deleteAll();
        mockMvc.perform(get("/api/courses"))
                .andExpect(status().isOk())
                .andExpect(content().string("[]"));
    }

    @Test
    public void SpringBoot_DevelopCoreAPIsAndBusinessLogic_TestCourseWithQuizHas2Questions() throws Exception {
        mockMvc.perform(get("/api/courses/" + courseId + "/quiz"))
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
public void SpringBoot_ProjectAnalysisAndUMLDiagram_TestSubmitQuizScoreOverrides() throws Exception {
    // Submit initial score
    mockMvc.perform(post("/api/courses/" + courseId + "/quiz?student=john_doe&score=60"))
            .andExpect(status().isOk());

    // Submit updated score
    mockMvc.perform(post("/api/courses/" + courseId + "/quiz?student=john_doe&score=90"))
            .andExpect(status().isOk());

    // Re-fetch updated entity
    mockMvc.perform(get("/api/courses"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].scores.john_doe").value(90));
}

}
