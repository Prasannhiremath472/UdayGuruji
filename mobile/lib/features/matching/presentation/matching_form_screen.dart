import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/network/api_exception.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/birth_details_form.dart';
import '../../home/presentation/account_dashboard_screen.dart';
import '../data/matching_service.dart';

class MatchingFormScreen extends ConsumerStatefulWidget {
  const MatchingFormScreen({super.key});

  @override
  ConsumerState<MatchingFormScreen> createState() => _MatchingFormScreenState();
}

class _MatchingFormScreenState extends ConsumerState<MatchingFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _groomData = BirthDetailsFormData();
  final _brideData = BirthDetailsFormData();
  final _groomFormKey = GlobalKey<BirthDetailsFormState>();
  final _brideFormKey = GlobalKey<BirthDetailsFormState>();
  bool _submitting = false;
  String? _error;

  @override
  void dispose() {
    _groomData.dispose();
    _brideData.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final groomOk = _groomFormKey.currentState?.validate() ?? false;
    final brideOk = _brideFormKey.currentState?.validate() ?? false;
    if (!groomOk || !brideOk) return;

    setState(() {
      _submitting = true;
      _error = null;
    });
    try {
      final match = await ref
          .read(matchingServiceProvider)
          .create(
            groom: PersonBirthDetails(
              fullName: _groomData.nameController.text.trim(),
              dateOfBirth: _groomData.dateOfBirthIso!,
              timeOfBirth: _groomData.timeOfBirthString!,
              placeOfBirth: _groomData.placeController.text.trim(),
            ),
            bride: PersonBirthDetails(
              fullName: _brideData.nameController.text.trim(),
              dateOfBirth: _brideData.dateOfBirthIso!,
              timeOfBirth: _brideData.timeOfBirthString!,
              placeOfBirth: _brideData.placeController.text.trim(),
            ),
          );
      if (mounted) {
        final query = match.accessToken != null
            ? '?accessToken=${match.accessToken}'
            : '';
        context.push('/matching/${match.id}$query');
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
      appBar: AppBar(title: const Text('Kundali Matching')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text(
                  'Enter both birth details for classical Guna Milan compatibility scoring.',
                  style: TextStyle(color: Colors.grey),
                ),
                const SizedBox(height: AppSpacing.xl),
                BirthDetailsForm(
                  key: _groomFormKey,
                  data: _groomData,
                  title: 'Groom',
                  nameLabel: "Groom's Name",
                ),
                const SizedBox(height: AppSpacing.xxl),
                const Divider(),
                const SizedBox(height: AppSpacing.xxl),
                BirthDetailsForm(
                  key: _brideFormKey,
                  data: _brideData,
                  title: 'Bride',
                  nameLabel: "Bride's Name",
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
                      : const Text('Check Compatibility'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
