package com.mybuddyworker.userservice.profile;

import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminSeeder implements CommandLineRunner {

    private final ProfileRepository profileRepository;

    @Override
    public void run(String... args) {
        String adminEmail = "superadmin@mybuddyworker.com";

        // 1. කලින් මේ Admin ව හදලා තියෙනවද කියලා Database එකෙන් බලනවා
        if (profileRepository.findByEmail(adminEmail).isPresent()) {
            log.info("✅ Super Admin දැනටමත් සාදා ඇත!");
            return;
        }

        log.info("⏳ Super Admin සෑදීම ආරම්භ කරමින්...");

        try {
            // 2. Keycloak එකට Connect වීම (Master Realm එක හරහා)
            Keycloak keycloak = KeycloakBuilder.builder()
                    .serverUrl("http://localhost:8080") // Keycloak දුවන URL එක
                    .realm("master")
                    .clientId("admin-cli")
                    .username("admin") // Keycloak Admin Username
                    .password("admin") // Keycloak Admin Password
                    .build();

            // 3. Keycloak එකේ අලුත් User ව හැදීම (Firebase auth.createUser වගේ)
            UserRepresentation user = new UserRepresentation();
            user.setUsername(adminEmail);
            user.setEmail(adminEmail);
            user.setFirstName("Kehan");
            user.setLastName("Hasalawa");
            user.setEnabled(true);

            // Password එක සෙට් කිරීම
            CredentialRepresentation credential = new CredentialRepresentation();
            credential.setType(CredentialRepresentation.PASSWORD);
            credential.setValue("Admin@12345");
            credential.setTemporary(false);
            user.setCredentials(Collections.singletonList(credential));

            // Keycloak එකේ "mybuddyworker" කියන Realm එකට User ව දානවා (මෙක අපි ඉස්සරහට හදනවා)
            // දැනට අපි ලේසියට master එකටම දාමු පස්සේ වෙනස් කරමු
            Response response = keycloak.realm("master").users().create(user);

            if (response.getStatus() == 201) {
                // 4. හැදුනු User ගේ ID එක Keycloak එකෙන් ගන්නවා (Firebase uid එක වගේ)
                String keycloakId = response.getLocation().getPath().replaceAll(".*/([^/]+)$", "$1");
                log.info("✅ Keycloak Auth User හැදුවා! UID: {}", keycloakId);

                // 5. PostgreSQL Database එකට දත්ත ඇතුලත් කිරීම
                UserProfile superAdmin = new UserProfile();
                superAdmin.setKeycloakId(keycloakId);
                superAdmin.setFullName("Kehan Hasalawa");
                superAdmin.setEmail(adminEmail);
                superAdmin.setMobile("0771234567");
                superAdmin.setNic("123456789V");
                superAdmin.setRole("Super Admin");

                profileRepository.save(superAdmin);
                log.info("✅ Database එකට දත්ත සාර්ථකව ඇතුලත් කළා!");
                log.info("🎉 Super Admin Seeder සාර්ථකයි!");
            } else {
                log.error("❌ Keycloak එකේ User ව හදන්න බැරි වුණා. Status Code: {}", response.getStatus());
            }

        } catch (Exception e) {
            log.error("❌ Error එකක් ආවා: {}", e.getMessage());
        }
    }
}