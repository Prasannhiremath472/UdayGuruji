import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/network/api_exception.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/birth_details_form.dart';
import '../../home/presentation/account_dashboard_screen.dart';

class KundaliFormScreen extends ConsumerStatefulWidget {
  const KundaliFormScreen({super.key});

  @override
  ConsumerState<KundaliFormScreen> createState() => _KundaliFormScreenState();
}

class _KundaliFormScreenState extends ConsumerState<KundaliFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _formData = BirthDetailsFormData();
  final _birthFormKey = GlobalKey<BirthDetailsFormState>();
  String? _gender;
  bool _submitting = false;
  String? _error;

  @override
  void dispose() {
    _formData.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!(_birthFormKey.currentState?.validate() ?? false)) return;
    setState(() {
      _submitting = true;
      _error = null;
    });
    try {
      final kundali = await ref
          .read(kundaliServiceProvider)
          .create(
            fullName: _formData.nameController.text.trim(),
            gender: _gender,
            dateOfBirth: _formData.dateOfBirthIso!,
            timeOfBirth: _formData.timeOfBirthString!,
            placeOfBirth: _formData.placeController.text.trim(),
          );
      if (mounted) {
        final query = kundali.accessToken != null
            ? '?accessToken=${kundali.accessToken}'
            : '';
        context.push('/kundali/${kundali.id}$query');
      }
    } on ApiException catch (e) {
      setState(
        () => _error = e.isValidationError && e.validationErrors.isNotEmpty
            ? e.validationErrors.first.message
            : e.message,
      );
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Generate Your Kundali')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text(
                  'Enter accurate birth details for a precise astrological report.',
                  style: TextStyle(color: Colors.grey),
                ),
                const SizedBox(height: AppSpacing.xl),
                BirthDetailsForm(key: _birthFormKey, data: _formData),
                const SizedBox(height: AppSpacing.lg),
                DropdownButtonFormField<String>(
                  initialValue: _gender,
                  decoration: const InputDecoration(
                    labelText: 'Gender (optional)',
                  ),
                  items: const [
                    DropdownMenuItem(value: 'male', child: Text('Male')),
                    DropdownMenuItem(value: 'female', child: Text('Female')),
                    DropdownMenuItem(value: 'other', child: Text('Other')),
                  ],
                  onChanged: (v) => setState(() => _gender = v),
                ),
                if (_error != null) ...[
                  const SizedBox(height: AppSpacing.md),
                  Text(_error!, style: const TextStyle(color: Colors.red)),
                ],
                const SizedBox(height: AppSpacing.xl),
                ElevatedButton(
                  onPressed: _submitting ? null : _submit,
                  child: _submitting
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : const Text('Generate Kundali'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
