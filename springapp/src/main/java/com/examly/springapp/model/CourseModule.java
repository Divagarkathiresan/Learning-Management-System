package com.examly.springapp.model;

import lombok.*;

import javax.persistence.*;

import java.util.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CourseModule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    @Column(length = 5000)
    private String content;

    @ElementCollection
    @CollectionTable(
        name = "quiz_questions",
        joinColumns = @JoinColumn(name = "course_id")
    )
    @Column(name = "question")
    private List<String> quizQuestions = new ArrayList<>();

    @ElementCollection
    private List<String> enrolledStudents = new ArrayList<>();

    @ElementCollection
    @MapKeyColumn(name = "student")
    @Column(name = "progress")
    private Map<String, Integer> progress = new HashMap<>();

    @ElementCollection
    @MapKeyColumn(name = "student")
    @Column(name = "score")
    private Map<String, Integer> scores = new HashMap<>();

}
