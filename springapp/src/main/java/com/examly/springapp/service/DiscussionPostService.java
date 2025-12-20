package com.examly.springapp.service;

import com.examly.springapp.model.Assessment;
import com.examly.springapp.model.DiscussionPost;
import com.examly.springapp.repository.AssessmentRepository;
import com.examly.springapp.repository.DiscussionPostRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DiscussionPostService {

    private final DiscussionPostRepository discussionRepo;
    private final AssessmentRepository assessmentRepo;

    public DiscussionPostService(DiscussionPostRepository discussionRepo, AssessmentRepository assessmentRepo) {
        this.discussionRepo = discussionRepo;
        this.assessmentRepo = assessmentRepo;
    }

    public List<DiscussionPost> getPostsByAssessment(Long assessmentId) {
        Assessment assessment = assessmentRepo.findById(assessmentId)
                .orElseThrow(() -> new RuntimeException("Assessment not found"));
        return assessment.getDiscussions();
    }

    public DiscussionPost addPost(Long assessmentId, DiscussionPost post) {
        Assessment assessment = assessmentRepo.findById(assessmentId)
                .orElseThrow(() -> new RuntimeException("Assessment not found"));
        post.setAssessment(assessment);
        return discussionRepo.save(post);
    }
}
