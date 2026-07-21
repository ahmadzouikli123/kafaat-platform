'use client';

import { useToast } from './Toast';

export default function MentorCard({ mentor }) {
  const showToast = useToast();

  return (
    <div className="mentor-card">
      <div className="mentor-avatar">{mentor.avatar_emoji}</div>
      <h3>{mentor.name}</h3>
      <div className="field">{mentor.field}</div>
      <div className="exp">
        {mentor.years_experience} سنة • {mentor.country}
      </div>
      <div className="rate">
        مجاناً <span>/ الجلسة</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3.5, justifyContent: 'center', marginBottom: 16 }}>
        {(mentor.skills || []).slice(0, 3).map((t) => (
          <span className="expert-skill" key={t}>
            {t}
          </span>
        ))}
      </div>
      <button
        className="btn btn-green w-full"
        onClick={() => showToast('قريباً', 'حجز جلسة الإرشاد قيد التطوير', 'info')}
      >
        <i className="fas fa-calendar-check" /> احجز جلسة
      </button>
    </div>
  );
}
