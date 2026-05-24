import 'package:flutter/material.dart';
import 'package:flutter_native_splash/flutter_native_splash.dart';  
import 'core/theme/app_theme.dart';
import 'features/splash/presentation/screens/splash_screen.dart';

void main() {
  WidgetsBinding widgetsBinding = WidgetsFlutterBinding.ensureInitialized();
  FlutterNativeSplash.preserve(widgetsBinding: widgetsBinding);
  WidgetsFlutterBinding.ensureInitialized();
  // Firebase initialization එක ඉස්සරහට මෙතනට එනවා
  // await Firebase.initializeApp();
  
  runApp(const MyBuddyWorkerApp());
}

class MyBuddyWorkerApp extends StatelessWidget {
  const MyBuddyWorkerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'My Buddy Worker',
      debugShowCheckedModeBanner: false,
      
      // Theme Management
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system, // ෆෝන් එකේ System Theme එකට Auto හැඩගැහෙනවා
      
      home: const SplashScreen(),
    );
  }
}