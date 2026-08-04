package com.mybuddyworker.userservice.profile;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_profiles")
@Data // Lombok වලින් Getters, Setters, toString ඉබේම හදනවා
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id; // අර Firebase වල තිබ්බ වගේම Unique ID එකක් එනවා

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String fullName;

    @Column(unique = true)
    private String mobile;

    private String role; // උදා: Student, Employer, Super Admin

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();
}