package com.examly.springapp.model;

import javax.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(unique = true)
    private String username;

    private String password; // for now plain text, can use BCrypt later
}
