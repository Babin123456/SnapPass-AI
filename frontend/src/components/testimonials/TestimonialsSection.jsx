import React, { useState, useEffect } from 'react';
import TestimonialCard from './TestimonialCard';
import AddTestimonialForm from './AddTestimonialForm';
import './TestimonialsSection.css';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations/translations';

const TestimonialsSection = ({ darkMode }) => {
  const { language } = useLanguage();
  const t = translations[language];
  const [testimonials, setTestimonials] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const savedTestimonials = localStorage.getItem('snappass_testimonials');
    if (savedTestimonials) {
      setTestimonials(JSON.parse(savedTestimonials));
    } else {
      const sampleTestimonials = [
        {
          id: 1,
          name: 'Tanya Oberio',
          rating: 5,
          commentEn:
            'As a photographer and Instagram handler, SnapPassAI is one of the best tools for me. It helps me quickly maintain lot of time with its simple and minimal workflow.',
          commentHi:
            'एक फोटोग्राफर और इंस्टाग्राम हैंडलर के रूप में, SnapPassAI मेरे लिए सबसे अच्छे टूल्स में से एक है। इसका सरल और न्यूनतम वर्कफ़्लो मेरा काफी समय बचाता है।',
          date: '2026-05-25T10:00:00Z'
        },
        {
          id: 2,
          name: 'Rahul Sharma',
          rating: 5,
          commentEn:
            'Amazing tool! Got my passport photo ready in seconds. Highly recommended!',
          commentHi:
            'शानदार टूल! मेरी पासपोर्ट फोटो कुछ ही सेकंड में तैयार हो गई। अत्यधिक अनुशंसित!',
          date: '2026-05-24T14:30:00Z'
        },
        {
          id: 3,
          name: 'Priya Patel',
          rating: 4,
          commentEn:
            'Very easy to use. The background removal works perfectly.',
          commentHi:
            'उपयोग करने में बहुत आसान। बैकग्राउंड हटाने की सुविधा बेहतरीन तरीके से काम करती है।',
          date: '2026-05-23T09:15:00Z'
        }
      ];
      setTestimonials(sampleTestimonials);
      localStorage.setItem('snappass_testimonials', JSON.stringify(sampleTestimonials));
    }
  }, []);

  useEffect(() => {
    if (testimonials.length > 0) {
      localStorage.setItem('snappass_testimonials', JSON.stringify(testimonials));
    }
  }, [testimonials]);

  const addTestimonial = (newTestimonial) => {
    setTestimonials(prev => [newTestimonial, ...prev]);
    setShowForm(false);
  };

  const calculateAverageRating = () => {
    if (testimonials.length === 0) return 0;
    const sum = testimonials.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / testimonials.length).toFixed(1);
  };

  return (
    <section className={`testimonials-section ${darkMode ? 'testimonials-section-dark' : 'testimonials-section-light'}`}>
      <div className="testimonials-container">
        <div className="testimonials-header">
          <h2 className={`section-title ${darkMode ? 'section-title-dark' : 'section-title-light'}`}>
            {t.testimonialsTitle}
          </h2>
          <p className={`testimonials-subtitle ${darkMode ? 'testimonials-subtitle-dark' : 'testimonials-subtitle-light'}`}>
            {t.testimonialsSubtitle}
          </p>
        </div>

        {testimonials.length > 0 && (
          <div style={{ textAlign: 'center' }}>
            <div className={`rating-summary ${darkMode ? 'rating-summary-dark' : 'rating-summary-light'}`}>
              <span className={`average-rating ${darkMode ? 'average-rating-dark' : 'average-rating-light'}`}>
                ⭐ {calculateAverageRating()}
              </span>
              <span className={`review-count ${darkMode ? 'review-count-dark' : 'review-count-light'}`}>
                ({testimonials.length} {testimonials.length === 1 ? t.review : t.reviews})
              </span>
            </div>
          </div>
        )}

        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              darkMode={darkMode}
            />
          ))}
        </div>

        {!showForm ? (
          <button
            className={`write-review-btn ${darkMode ? 'write-review-btn-dark' : 'write-review-btn-light'}`}
            onClick={() => setShowForm(true)}
          >
            {t.writeReview}
          </button>
        ) : (
          <AddTestimonialForm
            onSubmit={addTestimonial}
            onCancel={() => setShowForm(false)}
            darkMode={darkMode}
          />
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
