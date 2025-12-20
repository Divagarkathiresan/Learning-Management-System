package com.examly.springapp.model;

import lombok.*;
import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DiscussionPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String author;
    private String discussion;

    @ManyToOne
    @JoinColumn(name = "assessment_id")
    @JsonBackReference
    private Assessment assessment;
}
