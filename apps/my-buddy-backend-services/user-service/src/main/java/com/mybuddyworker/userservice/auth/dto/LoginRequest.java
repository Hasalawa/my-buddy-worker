package com.mybuddyworker.userservice.auth.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
    private boolean rememberMe;
}