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

  // Background Modern Animations (Floating Blobs)
  late Animation<Alignment> _blob1Alignment;
  late Animation<Alignment> _blob2Alignment;
  late Animation<double> _blobScale;

  // Foreground Animations (Phase 1 & 2)
  late Animation<double> _manScaleAnimation;
  late Animation<double> _manOpacityAnimation;
  late Animation<double> _fullLogoOpacityAnimation;
  late Animation<double> _fullLogoScaleAnimation;

  @override
  void initState() {
    super.initState();

    // මුළු ඇනිමේෂන් එකටම තත්පර 3ක් ලබා දී ඇත (30000ms Typo එක නිවැරදි කර ඇත)
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 3000),
    );

    // --- Modern Ambient Background Animations ---
    _blob1Alignment = AlignmentTween(
      begin: const Alignment(-1.5, -1.0),
      end: const Alignment(1.0, 1.5),
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOutSine,
    ));

    _blob2Alignment = AlignmentTween(
      begin: const Alignment(1.5, 1.0),
      end: const Alignment(-1.0, -1.5),
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOutSine,
    ));

    _blobScale = Tween<double>(begin: 1.0, end: 1.8).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    ));

    // --- PHASE 1: Man Icon Pop (0.0 - 0.45) ---
    _manScaleAnimation = Tween<double>(begin: 0.3, end: 1.1).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: const Interval(0.0, 0.45, curve: Curves.elasticOut),
      ),
    );
    _manOpacityAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: const Interval(0.0, 0.25, curve: Curves.easeIn),
      ),
    );

    // --- PHASE 2: Full Logo Reveal (0.50 - 0.90) ---
    _fullLogoOpacityAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: const Interval(0.50, 0.90, curve: Curves.easeInOut),
      ),
    );
    _fullLogoScaleAnimation = Tween<double>(begin: 1.1, end: 1.0).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: const Interval(0.50, 0.90, curve: Curves.easeOutCubic),
      ),
    );

    // Start Animation
    _animationController.forward();

    // Screen එක මාරු වෙන්න තත්පර 3.5ක් ලබා දී ඇත
    Timer(const Duration(milliseconds: 3500), () {
      if (mounted) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const LoginScreen()),
        );
      }
    });
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    final fullLogoPath = isDarkMode
        ? 'assets/images/logo.png'
        : 'assets/images/logo_lightMode.png';

    return Scaffold(
      backgroundColor: isDarkMode ? const Color(0xFF0A0A0A) : Colors.white,
      body: AnimatedBuilder(
        animation: _animationController,
        builder: (context, child) {
          final progress = _animationController.value;

          return Stack(
            children: [
              // --- 1. Background Cinematic Layer (Floating Orbs) ---
              // Top-Left to Bottom-Right moving Blob
              Align(
                alignment: _blob1Alignment.value,
                child: Transform.scale(
                  scale: _blobScale.value,
                  child: Container(
                    width: 320,
                    height: 320,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: RadialGradient(
                        colors: [
                          AppColors.brandGreen.withValues(alpha: isDarkMode ? 0.15 : 0.08),
                          AppColors.brandGreen.withValues(alpha: 0.0),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
              
              // Bottom-Right to Top-Left moving Blob
              Align(
                alignment: _blob2Alignment.value,
                child: Transform.scale(
                  scale: _blobScale.value,
                  child: Container(
                    width: 250,
                    height: 250,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: RadialGradient(
                        colors: [
                          AppColors.brandGreen.withValues(alpha: isDarkMode ? 0.12 : 0.06),
                          AppColors.brandGreen.withValues(alpha: 0.0),
                        ],
                      ),
                    ),
                  ),
                ),
              ),

              // --- 2. Foreground Logo Animation Layer ---
              Center(
                // AnimatedSwitcher එක හරහා Man Icon එක සහ Full Logo එක අතර මාරුවීම smooth කර ඇත.
                child: AnimatedSwitcher(
                  duration: const Duration(milliseconds: 350),
                  switchInCurve: Curves.easeInOut,
                  switchOutCurve: Curves.easeInOut,
                  child: progress < 0.50
                      ? _buildPhase1() // Step 1: Man Icon Pop
                      : _buildPhase2(fullLogoPath), // Step 2: Full Text Reveal
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  // --- Phase 1: Man Icon Jumping Out ---
  Widget _buildPhase1() {
    return Transform.scale(
      key: const ValueKey('phase1_man'),
      scale: _manScaleAnimation.value,
      child: Opacity(
        opacity: _manOpacityAnimation.value,
        child: Image.asset(
          'assets/images/logo_man.png',
          width: 120,
          height: 120,
          fit: BoxFit.contain,
        ),
      ),
    );
  }

  // --- Phase 2: Full Logo Smooth Reveal ---
  Widget _buildPhase2(String fullPath) {
    return Transform.scale(
      key: const ValueKey('phase2_logo'),
      scale: _fullLogoScaleAnimation.value,
      child: Opacity(
        opacity: _fullLogoOpacityAnimation.value,
        child: Image.asset(
          fullPath,
          width: 280,
          fit: BoxFit.contain,
        ),
      ),
    );
  }
}