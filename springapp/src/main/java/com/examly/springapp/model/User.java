package com.examly.springapp.model;

import javax.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")   // 🔥 IMPORTANT FIX
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

    private String password;

    private String role;
}
