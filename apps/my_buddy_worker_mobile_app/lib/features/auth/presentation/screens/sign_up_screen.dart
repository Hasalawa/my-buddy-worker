import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';

class SignUpScreen extends StatefulWidget {
  const SignUpScreen({super.key});

  @override
  State<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  // Controllers
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  
  bool _obscurePassword = true;
  bool _agreedToTerms = false;
  
  // Role Selection State
  String _selectedRole = 'worker'; // 'worker' or 'employer'

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: Icon(
            Icons.arrow_back_ios_new,
            color: isDarkMode ? Colors.white : Colors.black,
          ),
          onPressed: () => Navigator.pop(context),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 10.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 1. Header Texts
                Text(
                  "Create Account",
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: isDarkMode ? Colors.white : Colors.black87,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  "Join My Buddy Worker to start exploring opportunities.",
                  style: TextStyle(
                    fontSize: 15,
                    color: isDarkMode ? Colors.grey[400] : Colors.grey[600],
                  ),
                ),
                const SizedBox(height: 30),

                // 2. Role Selector (Worker vs Employer)
                Text(
                  "I want to...",
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: isDarkMode ? Colors.grey[300] : Colors.grey[700],
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: _buildRoleCard(
                        title: "Work / Earn",
                        icon: Icons.work_outline,
                        roleValue: 'worker',
                        isDarkMode: isDarkMode,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: _buildRoleCard(
                        title: "Hire Someone",
                        icon: Icons.business_center_outlined,
                        roleValue: 'employer',
                        isDarkMode: isDarkMode,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 30),

                // 3. Form Fields
                _buildTextField(
                  controller: _nameController,
                  label: "Full Name",
                  hintText: "Kehan Hasalawa",
                  icon: Icons.person_outline,
                  isDarkMode: isDarkMode,
                ),
                const SizedBox(height: 20),

                _buildTextField(
                  controller: _phoneController,
                  label: "Mobile Number",
                  hintText: "07X XXX XXXX",
                  icon: Icons.phone_outlined,
                  keyboardType: TextInputType.phone,
                  isDarkMode: isDarkMode,
                ),
                const SizedBox(height: 20),

                _buildTextField(
                  controller: _emailController,
                  label: "Email Address (Optional)",
                  hintText: "example@mail.com",
                  icon: Icons.mail_outline,
                  keyboardType: TextInputType.emailAddress,
                  isDarkMode: isDarkMode,
                ),
                const SizedBox(height: 20),

                _buildTextField(
                  controller: _passwordController,
                  label: "Password",
                  hintText: "Create a strong password",
                  icon: Icons.lock_outline,
                  obscureText: _obscurePassword,
                  isDarkMode: isDarkMode,
                  suffixIcon: IconButton(
                    icon: Icon(
                      _obscurePassword 
                          ? Icons.visibility_off_outlined 
                          : Icons.visibility_outlined,
                      color: isDarkMode ? Colors.grey[500] : Colors.grey[600],
                      size: 20,
                    ),
                    onPressed: () {
                      setState(() {
                        _obscurePassword = !_obscurePassword;
                      });
                    },
                  ),
                ),
                const SizedBox(height: 24),

                // 4. Terms and Conditions Checkbox
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    SizedBox(
                      width: 24,
                      height: 24,
                      child: Checkbox(
                        value: _agreedToTerms,
                        activeColor: AppColors.brandGreen,
                        side: BorderSide(
                          color: isDarkMode ? Colors.grey[600]! : Colors.grey[400]!,
                        ),
                        onChanged: (value) {
                          setState(() {
                            _agreedToTerms = value ?? false;
                          });
                        },
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        "I agree to the Terms of Service and Privacy Policy of My Buddy Worker.",
                        style: TextStyle(
                          color: isDarkMode ? Colors.grey[400] : Colors.grey[600],
                          fontSize: 13,
                          height: 1.4,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 30),

                // 5. Sign Up Button
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: ElevatedButton(
                    onPressed: _agreedToTerms 
                        ? () {
                            // TODO: Handle Sign Up Logic
                            debugPrint("Role: $_selectedRole");
                            debugPrint("Name: ${_nameController.text}");
                            debugPrint("Phone: ${_phoneController.text}");
                          }
                        : null, // Checkbox එක click කරේ නැත්නම් Button එක disable වෙනවා
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.brandGreen,
                      disabledBackgroundColor: isDarkMode ? Colors.grey[800] : Colors.grey[300],
                      foregroundColor: Colors.black,
                      elevation: _agreedToTerms ? 5 : 0,
                      shadowColor: AppColors.brandGreen.withValues(alpha: 0.3),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: Text(
                      "Create Account",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: _agreedToTerms 
                            ? Colors.black 
                            : (isDarkMode ? Colors.grey[500] : Colors.grey[500]),
                        letterSpacing: 0.5,
                      ),
                    ),
                  ),
                ),
                
                const SizedBox(height: 30),

                // 6. Navigate to Sign In
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      "Already have an account? ",
                      style: TextStyle(
                        color: isDarkMode ? Colors.grey[400] : Colors.grey[600],
                        fontSize: 14,
                      ),
                    ),
                    GestureDetector(
                      onTap: () {
                        Navigator.pop(context); // ආපහු Login එකට යනවා
                      },
                      child: const Text(
                        "Sign In",
                        style: TextStyle(
                          color: AppColors.brandGreen,
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // --- Role Selection Card Widget ---
  Widget _buildRoleCard({
    required String title,
    required IconData icon,
    required String roleValue,
    required bool isDarkMode,
  }) {
    final isSelected = _selectedRole == roleValue;
    
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedRole = roleValue;
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: isSelected 
              ? AppColors.brandGreen.withValues(alpha: 0.1)
              : (isDarkMode ? Colors.grey[900]?.withValues(alpha: 0.5) : Colors.grey[100]),
          border: Border.all(
            color: isSelected 
                ? AppColors.brandGreen 
                : (isDarkMode ? Colors.grey[800]! : Colors.grey[300]!),
            width: isSelected ? 2 : 1,
          ),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          children: [
            Icon(
              icon,
              color: isSelected 
                  ? AppColors.brandGreen 
                  : (isDarkMode ? Colors.grey[400] : Colors.grey[600]),
              size: 28,
            ),
            const SizedBox(height: 8),
            Text(
              title,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: isSelected 
                    ? AppColors.brandGreen 
                    : (isDarkMode ? Colors.grey[300] : Colors.grey[800]),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // --- Reusable Text Field Widget ---
  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required String hintText,
    required IconData icon,
    bool obscureText = false,
    TextInputType keyboardType = TextInputType.text,
    Widget? suffixIcon,
    required bool isDarkMode,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: isDarkMode ? Colors.grey[300] : Colors.grey[700],
          ),
        ),
        const SizedBox(height: 8),
        TextFormField(
          controller: controller,
          obscureText: obscureText,
          keyboardType: keyboardType,
          style: TextStyle(color: isDarkMode ? Colors.white : Colors.black),
          decoration: InputDecoration(
            hintText: hintText,
            hintStyle: TextStyle(
              color: isDarkMode ? Colors.grey[600] : Colors.grey[400],
            ),
            prefixIcon: Icon(
              icon,
              color: isDarkMode ? Colors.grey[500] : Colors.grey[400],
              size: 20,
            ),
            suffixIcon: suffixIcon,
            filled: true,
            fillColor: isDarkMode 
                ? Colors.grey[900]?.withValues(alpha: 0.5) 
                : Colors.grey[100],
            contentPadding: const EdgeInsets.symmetric(vertical: 16),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide(
                color: isDarkMode ? Colors.grey[800]! : Colors.grey[300]!,
              ),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide(
                color: isDarkMode ? Colors.grey[800]! : Colors.grey[300]!,
              ),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: const BorderSide(
                color: AppColors.brandGreen,
                width: 1.5,
              ),
            ),
          ),
        ),
      ],
    );
  }
}