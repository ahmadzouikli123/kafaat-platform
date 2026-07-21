'use client';

export default function Hero({ onRegisterClick }) {
  return (
    <section className="diaspora-hero" id="diasporaHero">
      <div className="diaspora-hero-scrim" />
      <div className="diaspora-hero-logo">
        <img src="/images/logo-2.png" alt="شعار المنصة" />
      </div>
      <div className="diaspora-hero-content">
        <h1>لربط خبرات السوريين حول العالم بفرص التنمية في الوطن</h1>
        <p>
          منصة وطنية تجمع الكفاءات السورية في الخارج مع فرص البناء والتطوير في سوريا، لتحويل
          الخبرة المكتسبة حول العالم إلى أثر ملموس في الداخل.
        </p>
        <div style={{ marginTop: 22 }}>
          <button className="btn btn-green btn-lg" onClick={onRegisterClick}>
            <i className="fas fa-user-plus" /> سجّل كفاءتك الآن
          </button>
        </div>
      </div>
    </section>
  );
}
