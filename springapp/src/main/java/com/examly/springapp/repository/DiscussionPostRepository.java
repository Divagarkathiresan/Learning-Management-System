package com.examly.springapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.examly.springapp.model.DiscussionPost;

public interface DiscussionPostRepository extends JpaRepository<DiscussionPost,Long>{

}
