import './Card.css';

export default function Card({ title, children, actions, className = '' }) {
  return (
    <section className={`card ${className}`}>
      {title || actions ? (
        <div className="card-header">
          {title ? <h2 className="card-title">{title}</h2> : <span />}
          {actions ? <div className="card-actions">{actions}</div> : null}
        </div>
      ) : null}
      <div className="card-body">{children}</div>
    </section>
  );
}
