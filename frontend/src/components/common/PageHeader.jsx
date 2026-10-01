import './PageHeader.css';

/**
 * Compact dark celestial banner used at the top of tool/content pages
 * (Kundali form, Horoscope, Panchang, Muhurat, Numerology, Matching,
 * About, Services, Contact) so every page shares the same premium
 * treatment as the homepage hero, at a smaller scale.
 */
export default function PageHeader({ title, subtitle }) {
  return (
    <div className="page-header">
      <div className="page-header-inner">
        <h1 className="page-header-title">{title}</h1>
        {subtitle ? <p className="page-header-subtitle">{subtitle}</p> : null}
      </div>
    </div>
  );
}
