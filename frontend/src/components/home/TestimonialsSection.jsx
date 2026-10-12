import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
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
  const [index, setIndex] = useState(0);

  const goTo = (i) => setIndex((i + TESTIMONIAL_KEYS.length) % TESTIMONIAL_KEYS.length);

  return (
    <section className="home-section home-section-bg-testimonial">
      <h2 className="home-section-title">{t('home.testimonials.title')}</h2>
      <p className="home-section-note">{t('home.testimonials.sampleNote')}</p>

      <div className="testimonial-carousel">
        <button
          type="button"
          className="testimonial-carousel-arrow testimonial-carousel-arrow-prev"
          aria-label={t('home.testimonials.previous')}
          onClick={() => goTo(index - 1)}
        >
          <FaChevronLeft aria-hidden="true" />
        </button>

        <div className="testimonial-carousel-track">
          {TESTIMONIAL_KEYS.map((key, i) => (
            <blockquote
              className={`testimonial-card ${i === index ? 'testimonial-card-active' : ''}`}
              key={key}
              aria-hidden={i !== index}
            >
              <p className="testimonial-quote">&ldquo;{t(`home.testimonials.items.${key}.quote`)}&rdquo;</p>
              <cite className="testimonial-author">{t(`home.testimonials.items.${key}.author`)}</cite>
            </blockquote>
          ))}
        </div>

        <button
          type="button"
          className="testimonial-carousel-arrow testimonial-carousel-arrow-next"
          aria-label={t('home.testimonials.next')}
          onClick={() => goTo(index + 1)}
        >
          <FaChevronRight aria-hidden="true" />
        </button>
      </div>

      <div className="testimonial-carousel-dots">
        {TESTIMONIAL_KEYS.map((key, i) => (
          <button
            key={key}
            type="button"
            className={`testimonial-carousel-dot ${i === index ? 'testimonial-carousel-dot-active' : ''}`}
            aria-label={`${i + 1}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  );
}
