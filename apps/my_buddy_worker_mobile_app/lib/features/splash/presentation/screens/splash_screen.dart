import 'dart:async';
import 'dart:math' as math;
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_native_splash/flutter_native_splash.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../features/auth/presentation/screens/login_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  late AnimationController _animationController;

  // Background Animations
  late Animation<Alignment> _blob1Alignment;
  late Animation<Alignment> _blob2Alignment;
  late Animation<double> _blobScale;

  // Foreground Animations
  late Animation<double> _gearScale;
  late Animation<double> _animationPartsOpacity;
  late Animation<double> _finalLogoOpacity;
  late Animation<double> _entireLogoScale; 

  @override
  void initState() {
    super.initState();
    FlutterNativeSplash.remove();

    // මුළු ඇනිමේෂන් එක සඳහා තත්පර 6.5ක් (ඉතාමත් Slow සහ Smooth)
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 6500),
    );

    // --- Background Ambient Movement ---
    _blob1Alignment = AlignmentTween(
      begin: const Alignment(-1.5, -1.0),
      end: const Alignment(1.0, 1.5),
    ).animate(CurvedAnimation(parent: _animationController, curve: Curves.easeInOutSine));

    _blob2Alignment = AlignmentTween(
      begin: const Alignment(1.5, 1.0),
      end: const Alignment(-1.0, -1.5),
    ).animate(CurvedAnimation(parent: _animationController, curve: Curves.easeInOutSine));

    _blobScale = Tween<double>(begin: 1.0, end: 1.8).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );

    // --- Gear Scale Sequence ---
    _gearScale = TweenSequence<double>([
      TweenSequenceItem(
        tween: Tween<double>(begin: 0.0, end: 1.5).chain(CurveTween(curve: Curves.easeOutCubic)),
        weight: 40,
      ),
      TweenSequenceItem(
        tween: Tween<double>(begin: 1.5, end: 1.0).chain(CurveTween(curve: Curves.easeInOut)),
        weight: 30,
      ),
      TweenSequenceItem(
        tween: ConstantTween<double>(1.0),
        weight: 30,
      ),
    ]).animate(_animationController);

    // --- Final Crossfade & Scale Up (0.70 to 1.0) ---
    _animationPartsOpacity = Tween<double>(begin: 1.0, end: 0.0).animate(
      CurvedAnimation(parent: _animationController, curve: const Interval(0.70, 1.0, curve: Curves.linear)),
    );
    _finalLogoOpacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: const Interval(0.70, 1.0, curve: Curves.easeInOut)),
    );
    _entireLogoScale = Tween<double>(begin: 0.95, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: const Interval(0.70, 1.0, curve: Curves.easeOutBack)),
    );

    _animationController.forward();

    // තත්පර 7 කින් පමණ ඊළඟ තිරයට මාරු වීම
    Timer(const Duration(milliseconds: 7000), () {
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
    
    // =================================================================
    // 🛠️ මේ අගයන් පමණක් වෙනස් කරලා 100% Pixel-Perfect කරගන්න
    // =================================================================
    const double logoSize = 360.0;     // සම්පූර්ණ ලෝගෝ එකේ විශාලත්වය
    const double targetGearSize = 28.0; // ලෝගෝ එක ඇතුළේ තියෙන ගියර් එකේ සයිස් එක

    // මැද ඉඳන් ගියර් එක තියෙන තැනට තියෙන දුර.
    // X සෘණ (-) කළොත් වමට යයි. Y සෘණ (-) කළොත් ඉහළට යයි.
    const double targetOffsetX = -36.0; 
    const double targetOffsetY = -44.0;
    // =================================================================

    return Scaffold(
      backgroundColor: isDarkMode ? const Color(0xFF0A0A0A) : Colors.white,
      body: AnimatedBuilder(
        animation: _animationController,
        builder: (context, child) {
          double progress = _animationController.value;

          // --- 1. Slow Wobble (දෙපසට සෙමින් චලනය වීම) ---
          double rotationAngle = 0.0;
          if (progress <= 0.40) {
            double p1 = progress / 0.40;
            // අංශක කිහිපයක් පමණක් වමට/දකුණට පැද්දේ
            rotationAngle = math.sin(p1 * 4 * math.pi) * (math.pi / 14); 
          } else {
            rotationAngle = 0.0; 
          }

          // --- 2. Center to Target Translation ---
          double currentOffsetX = 0.0;
          double currentOffsetY = 0.0;

          if (progress > 0.40 && progress <= 0.70) {
            // මැද (0,0) සිට නියමිත ස්ථානයට සුමටව ගමන් කිරීම
            double p2 = (progress - 0.40) / 0.30;
            double curveP2 = Curves.easeInOutCubic.transform(p2);
            currentOffsetX = lerpDouble(0, targetOffsetX, curveP2)!;
            currentOffsetY = lerpDouble(0, targetOffsetY, curveP2)!;
          } else if (progress > 0.70) {
            currentOffsetX = targetOffsetX;
            currentOffsetY = targetOffsetY;
          }

          double currentGearSize = targetGearSize * _gearScale.value;

          return Stack(
            children: [
              // --- Background Blobs ---
              Align(
                alignment: _blob1Alignment.value,
                child: Transform.scale(
                  scale: _blobScale.value,
                  child: _buildBlob(isDarkMode),
                ),
              ),
              Align(
                alignment: _blob2Alignment.value,
                child: Transform.scale(
                  scale: _blobScale.value,
                  child: _buildBlob(isDarkMode, isSmall: true),
                ),
              ),

              // --- Main Content ---
              Center(
                child: Transform.scale(
                  scale: progress > 0.70 ? _entireLogoScale.value : 1.0,
                  child: SizedBox(
                    width: logoSize,
                    height: logoSize,
                    child: Stack(
                      alignment: Alignment.center, // හැමදේම මැදට Align කරයි
                      children: [
                        // --- Gear Animation Layer ---
                        Opacity(
                          opacity: _animationPartsOpacity.value,
                          child: Transform.translate(
                            offset: Offset(currentOffsetX, currentOffsetY),
                            child: Transform.rotate(
                              angle: rotationAngle,
                              child: Image.asset(
                                'assets/images/gear.png',
                                width: currentGearSize,
                                height: currentGearSize,
                                fit: BoxFit.contain,
                              ),
                            ),
                          ),
                        ),

                        // --- Final Full Logo Layer ---
                        Opacity(
                          opacity: _finalLogoOpacity.value,
                          child: Image.asset(
                            isDarkMode ? 'assets/images/logo.png' : 'assets/images/logo_lightMode.png',
                            width: logoSize,
                            height: logoSize,
                            fit: BoxFit.contain,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildBlob(bool isDark, {bool isSmall = false}) {
    double size = isSmall ? 250 : 320;
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: RadialGradient(
          colors: [
            AppColors.brandGreen.withValues(alpha: isDark ? 0.15 : 0.08),
            AppColors.brandGreen.withValues(alpha: 0.0),
          ],
        ),
      ),
    );
  }
}