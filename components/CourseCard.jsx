'use client';

import { useToast } from './Toast';

export default function CourseCard({ course }) {
  const showToast = useToast();

  return (
    <div className="knowledge-card">
      <div className="knowledge-img">{course.icon}</div>
      <div className="knowledge-body">
        <h4>{course.title}</h4>
        <div className="expert-badges" style={{ marginBottom: 10 }}>
          <span className="expert-badge">مجاني</span>
          <span className="expert-badge">{course.level}</span>
          <span className="expert-badge">{course.format}</span>
        </div>
        <div className="knowledge-meta">
          <span className="author">
            <i className="fas fa-chalkboard-teacher" style={{ marginLeft: 4 }} /> {course.instructor_name} —{' '}
            {course.country}
          </span>
        </div>
        <div className="knowledge-meta" style={{ marginTop: 6 }}>
          <span>
            <i className="fas fa-clock" style={{ marginLeft: 4 }} /> {course.duration}
          </span>
          <span>
            <i className="fas fa-user-graduate" style={{ marginLeft: 4 }} /> {course.student_count} مشترك
          </span>
        </div>
        <button
          className="btn btn-green w-full"
          style={{ marginTop: 12 }}
          onClick={() => showToast('سجّل الآن', 'سيتم فتح صفحة التسجيل في الدورة قريباً', 'success')}
        >
          <i className="fas fa-graduation-cap" /> سجّل مجاناً
        </button>
      </div>
    </div>
  );
}
