import 'dart:async';
import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../features/auth/presentation/screens/login_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _scaleAnimation;
  late Animation<double> _opacityAnimation;

  @override
  void initState() {
    super.initState();

    // Setup Animations
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    );

    _scaleAnimation = Tween<double>(begin: 0.8, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeOutBack),
    );

    _opacityAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeIn),
    );

    _animationController.forward();

    // Navigate to next screen after 3 seconds
    Timer(const Duration(seconds: 3), () {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const LoginScreen()),
      );
    });
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Current theme එක check කරලා අදාළ ලෝගෝ එක තෝරගන්නවා
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    final logoPath = isDarkMode 
        ? 'assets/images/logo.png' 
        : 'assets/images/logo_lightMode.png';

    return Scaffold(
      body: Stack(
        children: [
          // Background Glow Effect
          Positioned(
            top: MediaQuery.of(context).size.height * 0.2,
            left: -50,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                // මෙතන අලුත් withValues එක දැම්මා
                color: AppColors.brandGreen.withValues(alpha: isDarkMode ? 0.15 : 0.05),
              ),
              // Blur effect using BackdropFilter or implicitly handling via Stack (simplified for performance)
            ),
          ),

          // Centered Content
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Animated Logo
                AnimatedBuilder(
                  animation: _animationController,
                  builder: (context, child) {
                    return Transform.scale(
                      scale: _scaleAnimation.value,
                      child: Opacity(
                        opacity: _opacityAnimation.value,
                        child: Image.asset(
                          logoPath,
                          width: 150, // ලෝගෝ එකේ size එක
                          fit: BoxFit.contain,
                        ),
                      ),
                    );
                  },
                ),
                
                const SizedBox(height: 40),

                // Custom Loading Indicator matching the brand
                SizedBox(
                  width: 150,
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: LinearProgressIndicator(
                      backgroundColor: isDarkMode 
                          ? Colors.grey[800] 
                          : Colors.grey[300],
                      valueColor: const AlwaysStoppedAnimation<Color>(
                        AppColors.brandGreen,
                      ),
                      minHeight: 4,
                    ),
                  ),
                ),
                
                const SizedBox(height: 20),
                
                // Status Text
                FadeTransition(
                  opacity: _opacityAnimation,
                  child: Text(
                    "INITIALIZING WORKSPACE...",
                    style: TextStyle(
                      // මෙතන අලුත් withValues එක දැම්මා
                      color: AppColors.brandGreen.withValues(alpha: 0.8),
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 2.0,
                    ),
                  ),
                )
              ],
            ),
          ),
        ],
      ),
    );
  }
}