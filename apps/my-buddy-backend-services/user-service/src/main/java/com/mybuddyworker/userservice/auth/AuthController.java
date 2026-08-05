package com.mybuddyworker.userservice.auth;

import com.mybuddyworker.userservice.auth.dto.LoginRequest;
import com.mybuddyworker.userservice.auth.dto.OtpRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // React Admin Panel එකට කතා කරන්න දෙනවා
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return authService.initiateLogin(request);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpRequest request) {
        return authService.verifyOtpAndCreateSession(request);
    }
}