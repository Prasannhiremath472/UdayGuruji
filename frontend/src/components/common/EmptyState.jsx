import './States.css';

export default function EmptyState({ title, description, action }) {
  return (
    <div className="state-container">
      <p className="state-title">{title}</p>
      {description ? <p className="state-message">{description}</p> : null}
      {action ? <div className="state-action">{action}</div> : null}
    </div>
  );
}
