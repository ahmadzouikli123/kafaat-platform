'use client';

export default function FeaturedCard({ expert, onViewProfile }) {
  return (
    <div className="featured-card">
      <div className="fc-badge">
        <i className="fas fa-check-circle" />
      </div>
      <div className="fc-avatar">{expert.avatar_emoji}</div>
      <h4>{expert.name}</h4>
      <div className="fc-title">{expert.title}</div>
      <div className="fc-country">{expert.country}</div>
      <div className="fc-skills">
        {(expert.skills || []).slice(0, 2).map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>
      <button className="btn btn-green btn-sm" style={{ width: '100%' }} onClick={onViewProfile}>
        عرض الملف
      </button>
    </div>
  );
}
