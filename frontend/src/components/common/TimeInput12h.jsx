import { useMemo } from 'react';
import './Input.css';
import './TimeInput12h.css';

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

function to24Hour(hour12, minute, period) {
  let hour24 = hour12 % 12;
  if (period === 'PM') hour24 += 12;
  return `${String(hour24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function from24Hour(value) {
  if (!value) return { hour12: '', minute: '', period: 'AM' };
  const [h, m] = value.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  let hour12 = h % 12;
  if (hour12 === 0) hour12 = 12;
  return { hour12: String(hour12), minute: String(m).padStart(2, '0'), period };
}

/**
 * Birth-time input as explicit Hour/Minute/AM-PM selects rather than a
 * native <input type="time">, whose AM/PM vs 24-hour display depends on
 * the browser/OS locale and can't be forced consistently. Emits the same
 * 24-hour "HH:MM" string the rest of the form/API expects.
 */
export default function TimeInput12h({ id, label, required, value, onChange, error }) {
  const { hour12, minute, period } = useMemo(() => from24Hour(value), [value]);

  const emitChange = (nextHour12, nextMinute, nextPeriod) => {
    if (!nextHour12 || nextMinute === '') return;
    const next24 = to24Hour(Number(nextHour12), Number(nextMinute), nextPeriod);
    onChange({ target: { value: next24 } });
  };

  return (
    <div className="field">
      {label ? (
        <label htmlFor={`${id}-hour`} className="field-label">
          {label}
          {required ? <span className="field-required">*</span> : null}
        </label>
      ) : null}
      <div className="time-input-group">
        <select
          id={`${id}-hour`}
          className={`field-select time-input-hour ${error ? 'field-input-error' : ''}`}
          value={hour12}
          onChange={(e) => emitChange(e.target.value, minute || '0', period)}
          aria-label="Hour"
        >
          <option value="" disabled>HH</option>
          {HOURS.map((h) => (
            <option key={h} value={h}>{String(h).padStart(2, '0')}</option>
          ))}
        </select>
        <span className="time-input-colon">:</span>
        <select
          id={`${id}-minute`}
          className={`field-select time-input-minute ${error ? 'field-input-error' : ''}`}
          value={minute}
          onChange={(e) => emitChange(hour12 || '12', e.target.value, period)}
          aria-label="Minute"
        >
          <option value="" disabled>MM</option>
          {MINUTES.map((m) => (
            <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
          ))}
        </select>
        <div className="time-input-period" role="group" aria-label="AM or PM">
          <button
            type="button"
            className={`time-period-btn ${period === 'AM' ? 'time-period-btn-active' : ''}`}
            onClick={() => emitChange(hour12 || '12', minute || '0', 'AM')}
            aria-pressed={period === 'AM'}
          >
            AM
          </button>
          <button
            type="button"
            className={`time-period-btn ${period === 'PM' ? 'time-period-btn-active' : ''}`}
            onClick={() => emitChange(hour12 || '12', minute || '0', 'PM')}
            aria-pressed={period === 'PM'}
          >
            PM
          </button>
        </div>
      </div>
      {error ? <span className="field-error" role="alert">{error}</span> : null}
    </div>
  );
}
