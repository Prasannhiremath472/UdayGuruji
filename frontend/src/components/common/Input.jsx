import './Input.css';

export default function Input({ label, id, error, hint, required, ...rest }) {
  return (
    <div className="field">
      {label ? (
        <label htmlFor={id} className="field-label">
          {label}
          {required ? <span className="field-required">*</span> : null}
        </label>
      ) : null}
      <input id={id} className={`field-input ${error ? 'field-input-error' : ''}`} {...rest} />
      {hint && !error ? <span className="field-hint">{hint}</span> : null}
      {error ? <span className="field-error" role="alert">{error}</span> : null}
    </div>
  );
}
