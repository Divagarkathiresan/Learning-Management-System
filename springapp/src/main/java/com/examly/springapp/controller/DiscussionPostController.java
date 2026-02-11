package com.examly.springapp.controller;

import com.examly.springapp.model.DiscussionPost;
import com.examly.springapp.service.DiscussionPostService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(
    origins = {
        "http://localhost:3000",
        "http://localhost:8081",
        "https://learning-management-system-cn9j.onrender.com",
        "https://learning-management-system-backend-y1dd.onrender.com"
    }
)

@RequestMapping("/api/assessments/{assessmentId}/discussions")
public class DiscussionPostController {

    private final DiscussionPostService service;

    public DiscussionPostController(DiscussionPostService service) {
        this.service = service;
    }

    @GetMapping
    public List<DiscussionPost> getPosts(@PathVariable Long assessmentId) {
        return service.getPostsByAssessment(assessmentId);
    }

    @PostMapping
    public DiscussionPost addPost(@PathVariable Long assessmentId, @RequestBody DiscussionPost post) {
        return service.addPost(assessmentId, post);
    }
}
