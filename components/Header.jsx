'use client';

export default function Header({ onContactClick }) {
  return (
    <header className="standalone-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 9,
            background: 'var(--green)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 19,
          }}
        >
          🌍
        </div>
        <div className="brand-text">
          <div className="t1">منصة الكفاءات السورية في الخارج</div>
          <div className="t2">Syrian Talents Abroad Platform</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          className="btn btn-outline btn-sm"
          onClick={onContactClick}
          style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}
        >
          <i className="fas fa-envelope" /> تواصل معنا
        </button>
      </div>
    </header>
  );
}
