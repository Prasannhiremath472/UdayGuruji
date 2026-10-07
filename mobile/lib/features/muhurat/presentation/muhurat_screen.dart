import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/api_exception.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/app_states.dart';
import '../../../core/widgets/date_place_result_view.dart';
import '../../panchang/data/panchang_service.dart';
import '../../panchang/presentation/panchang_screen.dart';

class MuhuratScreen extends ConsumerStatefulWidget {
  const MuhuratScreen({super.key});

  @override
  ConsumerState<MuhuratScreen> createState() => _MuhuratScreenState();
}

class _MuhuratScreenState extends ConsumerState<MuhuratScreen> {
  final _placeController = TextEditingController();
  DateTime _date = DateTime.now();
  bool _loading = false;
  String? _error;
  PanchangResult? _result;

  @override
  void dispose() {
    _placeController.dispose();
    super.dispose();
  }

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _date,
      firstDate: DateTime(1900),
      lastDate: DateTime(2100),
    );
    if (picked != null) setState(() => _date = picked);
  }

  Future<void> _submit() async {
    if (_placeController.text.trim().length < 2) {
      setState(() => _error = 'Place is required');
      return;
    }
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final result = await ref
          .read(panchangServiceProvider)
          .getMuhurat(
            date: _date.toIso8601String().split('T').first,
            place: _placeController.text.trim(),
          );
      setState(() => _result = result);
    } on ApiException catch (e) {
      setState(() => _error = e.message);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Muhurat')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              InkWell(
                onTap: _pickDate,
                child: InputDecorator(
                  decoration: const InputDecoration(labelText: 'Date'),
                  child: Text(_date.toIso8601String().split('T').first),
                ),
              ),
              const SizedBox(height: AppSpacing.lg),
              TextField(
                controller: _placeController,
                decoration: const InputDecoration(labelText: 'Place'),
              ),
              if (_error != null) ...[
                const SizedBox(height: AppSpacing.md),
                Text(_error!, style: const TextStyle(color: Colors.red)),
              ],
              const SizedBox(height: AppSpacing.xl),
              ElevatedButton(
                onPressed: _loading ? null : _submit,
                child: _loading
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.white,
                        ),
                      )
                    : const Text('Get Muhurat'),
              ),
              const SizedBox(height: AppSpacing.xl),
              if (_loading)
                const AppLoadingState()
              else if (_result != null)
                DynamicFieldsView(fields: _result!.fields),
            ],
          ),
        ),
      ),
    );
  }
}
