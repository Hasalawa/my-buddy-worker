package com.mybuddyworker.userservice.auth;

import com.mybuddyworker.userservice.auth.dto.LoginRequest;
import com.mybuddyworker.userservice.auth.dto.OtpRequest;
import com.mybuddyworker.userservice.profile.ProfileRepository;
import com.mybuddyworker.userservice.profile.UserProfile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final ProfileRepository profileRepository;

    // Industrial Level වලදී මේක තියාගන්නේ Redis Cache එකේ (ඔයාගේ Architecture diagram එකේ වගේ).
    // දැනට අපි Redis දානකම් RAM එකේ (ConcurrentHashMap) තියාගමු.
    private final Map<String, String> otpCache = new ConcurrentHashMap<>();

    // Cryptographically secure අහඹු අංක හදන්න මේක පාවිච්චි කරනවා
    private final SecureRandom secureRandom = new SecureRandom();

    public ResponseEntity<?> initiateLogin(LoginRequest request) {
        String email = request.getEmail();
        log.info("ලොගින් වීමට උත්සාහ කරයි: {}", email);

        // 1. Database එකෙන් User ව හොයනවා
        Optional<UserProfile> userOpt = profileRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            log.warn("❌ Database එකේ මෙහෙම Email එකක් නෑ: {}", email);
            // Security Best Practice: User Enumeration වලක්වන්න සාමාන්‍ය Error එකක් දෙනවා
            return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
        }

        UserProfile user = userOpt.get();

        // 2. Keycloak එකට කතා කරලා Password එක හරිද කියලා බලනවා
        try {
            Keycloak keycloak = KeycloakBuilder.builder()
                    .serverUrl("http://localhost:8080")
                    .realm("master") // ඉදිරියේදී මේක වෙනස් කරමු
                    .clientId("admin-cli")
                    .username(email)
                    .password(request.getPassword())
                    .build();

            // මේකෙන් ඇත්තටම Token එක අරන් බලනවා Password එක හරිද කියලා
            keycloak.tokenManager().getAccessTokenString();

        } catch (Exception e) {
            log.error("❌ Keycloak එකෙන් Password එක ප්‍රතික්ෂේප කළා: {}", email);
            return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
        }

        // 3. Password හරි නම්, ඉලක්කම් 6ක Random OTP එකක් හදනවා
        String generatedOtp = String.format("%06d", secureRandom.nextInt(999999));

        // 4. ඒක Cache එකේ (දැනට Map එකේ) Save කරගන්නවා
        otpCache.put(email, generatedOtp);

        // 5. ඇත්ත Database එකේ තියෙන Mobile Number එකට SMS එක යවනවා (දැනට Log එකක් දාමු)
        log.info("✅ SMS යැව්වා! Number: {}, OTP Code: {}", user.getMobile(), generatedOtp);

        System.out.println("\n=======================================================");
        System.out.println("🔐 My Buddy Worker ADMIN OTP CODE : " + generatedOtp);
        System.out.println("=======================================================\n");

        return ResponseEntity.ok(Map.of("message", "OTP Sent to registered mobile number."));
    }

    public ResponseEntity<?> verifyOtpAndCreateSession(OtpRequest request) {
        String email = request.getEmail();
        log.info("OTP පරීක්ෂා කරයි: {}", email);

        // 1. Cache එකේ තියෙන OTP එක අරගන්නවා
        String savedOtp = otpCache.get(email);

        // 2. OTP එක හරිද කියලා බලනවා
        if (savedOtp != null && savedOtp.equals(request.getOtp())) {

            // 3. OTP එක පාවිච්චි කරපු ගමන් ඒක Cache එකෙන් අයින් කරනවා (Replay Attack Protection)
            otpCache.remove(email);

            // Database එකෙන් User ගේ විස්තර ගන්නවා
            UserProfile user = profileRepository.findByEmail(email).orElseThrow();

            // 4. HttpOnly Session Cookie එක හදනවා
            String fakeKeycloakToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_token_xyz";

            ResponseCookie sessionCookie = ResponseCookie.from("SESSION_TOKEN", fakeKeycloakToken)
                    .httpOnly(true)
                    .secure(false) // Production වලදී HTTPS නිසා true කරන්න
                    .path("/")
                    .maxAge(24 * 60 * 60) // දවසක් වලංගුයි
                    .sameSite("Strict")
                    .build();

            log.info("✅ OTP හරි! {} සඳහා Session Cookie එකක් හැදුවා.", email);

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, sessionCookie.toString())
                    .body(Map.of(
                            "message", "Login Successful!",
                            "role", user.getRole(),
                            "name", user.getFullName()
                    ));
        }

        log.error("❌ OTP වැරදියි හෝ කල් ඉකුත් වෙලා!");
        return ResponseEntity.status(401).body(Map.of("error", "Invalid or expired OTP"));
    }
}