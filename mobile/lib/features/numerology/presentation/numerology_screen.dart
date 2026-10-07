import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/api_exception.dart';
import '../../../core/providers.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/section_card.dart';
import '../data/numerology_service.dart';

final numerologyServiceProvider = Provider(
  (ref) => NumerologyService(ref.watch(apiClientProvider)),
);

class NumerologyScreen extends ConsumerStatefulWidget {
  const NumerologyScreen({super.key});

  @override
  ConsumerState<NumerologyScreen> createState() => _NumerologyScreenState();
}

class _NumerologyScreenState extends ConsumerState<NumerologyScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  DateTime? _dateOfBirth;
  bool _submitting = false;
  String? _error;
  NumerologyResult? _result;

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  Future<void> _pickDate() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime(now.year - 25),
      firstDate: DateTime(1900),
      lastDate: now,
    );
    if (picked != null) setState(() => _dateOfBirth = picked);
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate() || _dateOfBirth == null) {
      if (_dateOfBirth == null) {
        setState(() => _error = 'Date of birth is required');
      }
      return;
    }
    setState(() {
      _submitting = true;
      _error = null;
    });
    try {
      final result = await ref
          .read(numerologyServiceProvider)
          .calculate(
            fullName: _nameController.text.trim(),
            dateOfBirth: _dateOfBirth!.toIso8601String().split('T').first,
          );
      setState(() => _result = result);
    } on ApiException catch (e) {
      setState(() => _error = e.message);
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Numerology')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                TextFormField(
                  controller: _nameController,
                  decoration: const InputDecoration(labelText: 'Full Name'),
                  validator: (v) => (v == null || v.trim().length < 2)
                      ? 'Name is required'
                      : null,
                ),
                const SizedBox(height: AppSpacing.lg),
                InkWell(
                  onTap: _pickDate,
                  child: InputDecorator(
                    decoration: const InputDecoration(
                      labelText: 'Date of Birth',
                    ),
                    child: Text(
                      _dateOfBirth == null
                          ? 'Select date'
                          : _dateOfBirth!.toIso8601String().split('T').first,
                    ),
                  ),
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
                      : const Text('Calculate'),
                ),
                if (_result != null) ...[
                  const SizedBox(height: AppSpacing.xl),
                  _NumberCard(_result!.lifePath),
                  const SizedBox(height: AppSpacing.md),
                  _NumberCard(_result!.destiny),
                  const SizedBox(height: AppSpacing.md),
                  _NumberCard(_result!.soulUrge),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _NumberCard extends StatelessWidget {
  const _NumberCard(this.number);
  final NumerologyNumber number;

  @override
  Widget build(BuildContext context) {
    return SectionCard(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 56,
            height: 56,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Theme.of(context).colorScheme.primary,
            ),
            child: Text(
              '${number.number}',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(width: AppSpacing.lg),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  number.label,
                  style: const TextStyle(fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 4),
                Text(number.meaning),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
