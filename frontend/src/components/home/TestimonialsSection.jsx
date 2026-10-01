import { useTranslation } from 'react-i18next';
import './HomeSections.css';

/**
 * Placeholder sample testimonials for layout purposes only - there is no
 * real customer review data source yet. Replace with real, consented
 * customer testimonials (or wire to a reviews backend) before treating
 * this section as representing actual customer feedback.
 */
const TESTIMONIAL_KEYS = ['sample1', 'sample2', 'sample3'];

export default function TestimonialsSection() {
  const { t } = useTranslation();

  return (
    <section className="home-section">
      <h2 className="home-section-title">{t('home.testimonials.title')}</h2>
      <p className="home-section-note">{t('home.testimonials.sampleNote')}</p>
      <div className="testimonials-grid">
        {TESTIMONIAL_KEYS.map((key) => (
          <blockquote className="testimonial-card" key={key}>
            <p className="testimonial-quote">&ldquo;{t(`home.testimonials.items.${key}.quote`)}&rdquo;</p>
            <cite className="testimonial-author">{t(`home.testimonials.items.${key}.author`)}</cite>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
