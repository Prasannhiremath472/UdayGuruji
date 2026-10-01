import './Input.css';

export default function Select({ label, id, error, required, options, ...rest }) {
  return (
    <div className="field">
      {label ? (
        <label htmlFor={id} className="field-label">
          {label}
          {required ? <span className="field-required">*</span> : null}
        </label>
      ) : null}
      <select id={id} className={`field-select ${error ? 'field-input-error' : ''}`} {...rest}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? <span className="field-error" role="alert">{error}</span> : null}
    </div>
  );
}
