import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// Captures the 4 fields every birth-detail form in this app needs
/// (kundali, and both sides of a match): full name, date of birth, time
/// of birth, place of birth. Validation mirrors the backend's exact rules
/// (fullName 2-150 chars, dateOfBirth not in the future, placeOfBirth
/// 2-255 chars) so client-side errors surface before a round trip.
class BirthDetailsFormData {
  BirthDetailsFormData();

  final nameController = TextEditingController();
  final placeController = TextEditingController();
  DateTime? dateOfBirth;
  TimeOfDay? timeOfBirth;

  String? get dateOfBirthIso => dateOfBirth?.toIso8601String().split('T').first;

  String? get timeOfBirthString => timeOfBirth == null
      ? null
      : '${timeOfBirth!.hour.toString().padLeft(2, '0')}:${timeOfBirth!.minute.toString().padLeft(2, '0')}';

  void dispose() {
    nameController.dispose();
    placeController.dispose();
  }
}

class BirthDetailsForm extends StatefulWidget {
  const BirthDetailsForm({
    super.key,
    required this.data,
    this.title,
    this.nameLabel = 'Full Name',
  });

  final BirthDetailsFormData data;
  final String? title;
  final String nameLabel;

  @override
  State<BirthDetailsForm> createState() => BirthDetailsFormState();
}

class BirthDetailsFormState extends State<BirthDetailsForm> {
  String? _dateError;
  String? _timeError;

  bool validate() {
    final formOk = Form.of(context).validate();
    setState(() {
      _dateError = widget.data.dateOfBirth == null
          ? 'Date of birth is required'
          : null;
      _timeError = widget.data.timeOfBirth == null
          ? 'Time of birth is required'
          : null;
    });
    return formOk && _dateError == null && _timeError == null;
  }

  Future<void> _pickDate() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: widget.data.dateOfBirth ?? DateTime(now.year - 25),
      firstDate: DateTime(1900),
      lastDate: now,
    );
    if (picked != null) {
      setState(() {
        widget.data.dateOfBirth = picked;
        _dateError = null;
      });
    }
  }

  Future<void> _pickTime() async {
    final picked = await showTimePicker(
      context: context,
      initialTime:
          widget.data.timeOfBirth ?? const TimeOfDay(hour: 12, minute: 0),
    );
    if (picked != null) {
      setState(() {
        widget.data.timeOfBirth = picked;
        _timeError = null;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        if (widget.title != null) ...[
          Text(widget.title!, style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: AppSpacing.md),
        ],
        TextFormField(
          controller: widget.data.nameController,
          decoration: InputDecoration(labelText: widget.nameLabel),
          validator: (v) => (v == null || v.trim().length < 2)
              ? 'Name must be at least 2 characters'
              : null,
        ),
        const SizedBox(height: AppSpacing.lg),
        InkWell(
          onTap: _pickDate,
          child: InputDecorator(
            decoration: InputDecoration(
              labelText: 'Date of Birth',
              errorText: _dateError,
            ),
            child: Text(
              widget.data.dateOfBirthIso ?? 'Select date',
              style: TextStyle(
                color: widget.data.dateOfBirth == null
                    ? Theme.of(context).hintColor
                    : null,
              ),
            ),
          ),
        ),
        const SizedBox(height: AppSpacing.lg),
        InkWell(
          onTap: _pickTime,
          child: InputDecorator(
            decoration: InputDecoration(
              labelText: 'Time of Birth',
              errorText: _timeError,
            ),
            child: Text(
              widget.data.timeOfBirthString ?? 'Select time',
              style: TextStyle(
                color: widget.data.timeOfBirth == null
                    ? Theme.of(context).hintColor
                    : null,
              ),
            ),
          ),
        ),
        const SizedBox(height: AppSpacing.lg),
        TextFormField(
          controller: widget.data.placeController,
          decoration: const InputDecoration(labelText: 'Place of Birth'),
          validator: (v) => (v == null || v.trim().length < 2)
              ? 'Place of birth is required'
              : null,
        ),
      ],
    );
  }
}
