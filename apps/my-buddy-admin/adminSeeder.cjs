const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");
const { log } = require("console");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

const seedSuperAdmin = async () => {
  try {
    console.log("⏳ Super Admin සෑදීම ආරම්භ කරමින්...");

    const userRecord = await auth.createUser({
      email: "superadmin@mybuddyworker.com",
      password: "Admin@12345",
      displayName: "Kehan Hasalawa",
    });

    const uid = userRecord.uid;
    console.log(`✅ Auth User හැදුවා! UID: ${uid}`);

    await auth.setCustomUserClaims(uid, { role: "Super Admin", isAdmin: true });
    console.log("✅ Super Admin බලතල ලබා දුන්නා!");

    await db.collection("admins").doc(uid).set({
      uid: uid,
      name: "Kehan Hasalawa",
      email: "superadmin@mybuddyworker.com",
      mobile: "0771234567",
      nic: "123456789V",
      role: "Super Admin",
      twoFactorEnabled: true,
      loginTime: admin.firestore.FieldValue.serverTimestamp(),
      logoutTime: null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      permissions: {
        manageUsers: true,
        manageJobs: true,
        viewFinancials: true,
        systemSettings: true,
      }
    });
    console.log("✅ Database එකට දත්ත සාර්ථකව ඇතුලත් කළා!");

    console.log("🎉 Super Admin Seeder සාර්ථකයි!");
    process.exit();

  } catch (error) {
    console.error("❌ Error එකක් ආවා:", error.message);
    process.exit(1);
  }
};

seedSuperAdmin();