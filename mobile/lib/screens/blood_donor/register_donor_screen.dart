import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../config/app_theme.dart';
import '../../config/app_constants.dart';
import '../../models/blood_donor_model.dart';
import '../../services/blood_donor_service.dart';
import '../../services/auth_service.dart';

class RegisterDonorScreen extends ConsumerStatefulWidget {
  const RegisterDonorScreen({super.key});

  @override
  ConsumerState<RegisterDonorScreen> createState() =>
      _RegisterDonorScreenState();
}

class _RegisterDonorScreenState extends ConsumerState<RegisterDonorScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _addressController = TextEditingController();
  final _ageController = TextEditingController();

  String _selectedBloodGroup = 'A+';
  String _selectedUpazila = 'tangail_sadar';
  String _selectedGender = 'male';
  bool _isLoading = false;

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _addressController.dispose();
    _ageController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    final authService = AuthService();
    if (!authService.isLoggedIn) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('রেজিস্ট্রেশনের জন্য লগইন করুন')),
      );
      return;
    }

    setState(() => _isLoading = true);
    try {
      final donor = BloodDonorModel(
        id: '',
        userId: authService.currentUser!.uid,
        name: _nameController.text.trim(),
        phone: _phoneController.text.trim(),
        bloodGroup: _selectedBloodGroup,
        upazilaId: _selectedUpazila,
        address: _addressController.text.trim(),
        totalDonations: 0,
        isAvailable: true,
        gender: _selectedGender,
        age: int.tryParse(_ageController.text) ?? 0,
      );

      await BloodDonorService().registerDonor(donor);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('সফলভাবে ডোনার হিসেবে রেজিস্ট্রেশন হয়েছে'),
            backgroundColor: AppTheme.successColor,
          ),
        );
        context.pop();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('ত্রুটি: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('রক্তদাতা হিসেবে যোগ দিন')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Banner
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.secondaryColor.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                      color: AppTheme.secondaryColor.withOpacity(0.3)),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.favorite_rounded,
                        color: AppTheme.secondaryColor),
                    SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'আপনার রক্ত একটি জীবন বাঁচাতে পারে। বিনামূল্যে ডোনার হিসেবে যোগ দিন।',
                        style: TextStyle(
                            fontSize: 13, color: AppTheme.secondaryColor),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              _buildLabel('পূর্ণ নাম'),
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(hintText: 'আপনার নাম'),
                validator: (v) =>
                    v == null || v.isEmpty ? 'নাম দিন' : null,
              ),
              const SizedBox(height: 16),

              _buildLabel('মোবাইল নম্বর'),
              TextFormField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                decoration:
                    const InputDecoration(hintText: '01XXXXXXXXX'),
                validator: (v) {
                  if (v == null || v.isEmpty) return 'মোবাইল নম্বর দিন';
                  if (v.length < 11) return 'সঠিক নম্বর দিন';
                  return null;
                },
              ),
              const SizedBox(height: 16),

              _buildLabel('রক্তের গ্রুপ'),
              DropdownButtonFormField<String>(
                value: _selectedBloodGroup,
                items: AppConstants.bloodGroups
                    .map((bg) =>
                        DropdownMenuItem(value: bg, child: Text(bg)))
                    .toList(),
                onChanged: (v) =>
                    setState(() => _selectedBloodGroup = v!),
                decoration: const InputDecoration(hintText: 'রক্তের গ্রুপ'),
              ),
              const SizedBox(height: 16),

              _buildLabel('উপজেলা'),
              DropdownButtonFormField<String>(
                value: _selectedUpazila,
                items: const [
                  DropdownMenuItem(
                      value: 'tangail_sadar', child: Text('টাঙ্গাইল সদর')),
                  DropdownMenuItem(
                      value: 'mirzapur', child: Text('মির্জাপুর')),
                  DropdownMenuItem(
                      value: 'madhupur', child: Text('মধুপুর')),
                  DropdownMenuItem(
                      value: 'ghatail', child: Text('ঘাটাইল')),
                  DropdownMenuItem(
                      value: 'kalihati', child: Text('কালিহাতী')),
                  DropdownMenuItem(value: 'basail', child: Text('বাসাইল')),
                  DropdownMenuItem(
                      value: 'bhuapur', child: Text('ভূয়াপুর')),
                  DropdownMenuItem(
                      value: 'delduar', child: Text('দেলদুয়ার')),
                  DropdownMenuItem(
                      value: 'dhanbari', child: Text('ধনবাড়ী')),
                  DropdownMenuItem(
                      value: 'gopalpur', child: Text('গোপালপুর')),
                  DropdownMenuItem(
                      value: 'nagarpur', child: Text('নাগরপুর')),
                  DropdownMenuItem(
                      value: 'sakhipur', child: Text('সখিপুর')),
                ],
                onChanged: (v) =>
                    setState(() => _selectedUpazila = v!),
                decoration: const InputDecoration(hintText: 'উপজেলা'),
              ),
              const SizedBox(height: 16),

              _buildLabel('ঠিকানা'),
              TextFormField(
                controller: _addressController,
                decoration:
                    const InputDecoration(hintText: 'গ্রাম/এলাকা, উপজেলা'),
                validator: (v) =>
                    v == null || v.isEmpty ? 'ঠিকানা দিন' : null,
              ),
              const SizedBox(height: 16),

              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildLabel('বয়স'),
                        TextFormField(
                          controller: _ageController,
                          keyboardType: TextInputType.number,
                          decoration:
                              const InputDecoration(hintText: 'বয়স'),
                          validator: (v) {
                            if (v == null || v.isEmpty) return 'বয়স দিন';
                            final age = int.tryParse(v);
                            if (age == null || age < 18 || age > 60) {
                              return '১৮-৬০ বছর';
                            }
                            return null;
                          },
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildLabel('লিঙ্গ'),
                        DropdownButtonFormField<String>(
                          value: _selectedGender,
                          items: const [
                            DropdownMenuItem(
                                value: 'male', child: Text('পুরুষ')),
                            DropdownMenuItem(
                                value: 'female', child: Text('মহিলা')),
                          ],
                          onChanged: (v) =>
                              setState(() => _selectedGender = v!),
                          decoration: const InputDecoration(),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 32),

              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _submit,
                  style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.secondaryColor),
                  child: _isLoading
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(
                              color: Colors.white, strokeWidth: 2))
                      : const Text('ডোনার হিসেবে রেজিস্ট্রেশন করুন'),
                ),
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Text(text,
          style: const TextStyle(
              fontSize: 14, fontWeight: FontWeight.w600)),
    );
  }
}
