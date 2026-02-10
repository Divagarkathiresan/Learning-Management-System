package com.examly.springapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.examly.springapp.model.DiscussionPost;

@Repository
public interface DiscussionPostRepository extends JpaRepository<DiscussionPost,Long>{

}
