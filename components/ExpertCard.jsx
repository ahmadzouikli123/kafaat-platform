'use client';

import { useToast } from './Toast';

export default function ExpertCard({ expert }) {
  const showToast = useToast();

  return (
    <div className="expert-card">
      <div className="expert-card-header">
        <div className="expert-avatar">{expert.avatar_emoji}</div>
        <div className="expert-info">
          <h3>{expert.name}</h3>
          <div className="title">{expert.title}</div>
          <div className="location">
            <i className="fas fa-map-marker-alt" /> {expert.city}، {expert.country}
          </div>
        </div>
      </div>
      <div className="expert-badges">
        <span className="expert-badge">{expert.field}</span>
        <span className="expert-badge">{expert.years_experience} سنة خبرة</span>
        <span className="expert-badge">{expert.available ? 'متاح' : 'مشغول'}</span>
        {!expert.is_verified && <span className="expert-badge">قيد التحقق</span>}
      </div>
      <div className="expert-skills">
        {(expert.skills || []).map((s) => (
          <span className="expert-skill" key={s}>
            {s}
          </span>
        ))}
      </div>
      <p style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 16, flex: 1 }}>
        {expert.bio}
      </p>
      <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 12 }}>
        <i className="fas fa-language" style={{ marginLeft: 4 }} /> {(expert.languages || []).join('، ')}
      </div>
      <div className="expert-footer">
        <button
          className="btn btn-green btn-sm"
          onClick={() => showToast('قريباً', 'التواصل المباشر قيد التطوير', 'info')}
        >
          <i className="fas fa-envelope" /> تواصل
        </button>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => showToast('تم', 'تم حفظ الملف', 'success')}
        >
          <i className="fas fa-bookmark" /> حفظ
        </button>
      </div>
    </div>
  );
}
