'use client';

import { useToast } from './Toast';

const STATUS_LABEL = { open: 'متاح', 'in-progress': 'قيد التنفيذ', closed: 'منجز' };

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function ProjectCard({ project }) {
  const showToast = useToast();
  const budget =
    project.budget_min && project.budget_max
      ? `${project.budget_min} - ${project.budget_max}`
      : project.budget_min
      ? `${project.budget_min}+`
      : 'غير محدد';

  return (
    <div className="project-card">
      <div className="project-card-header">
        <span className={`project-status ${project.status}`}>
          {STATUS_LABEL[project.status] || project.status}
        </span>
        <span style={{ fontSize: 11, color: 'var(--muted)' }}>{formatDate(project.created_at)}</span>
      </div>
      <h3>{project.title}</h3>
      <p className="desc">{project.description}</p>
      <div className="project-meta">
        <span>
          <i className="fas fa-industry" /> {project.field}
        </span>
        <span>
          <i className="fas fa-clock" /> {project.duration}
        </span>
        <span>
          <i className="fas fa-laptop" /> {project.work_type}
        </span>
      </div>
      <div className="project-budget">
        {budget} <span>دولار</span>
      </div>
      <button
        className="btn btn-green w-full"
        onClick={() => showToast('قريباً', 'التقديم على المشاريع قيد التطوير', 'info')}
      >
        <i className="fas fa-paper-plane" /> تقديم عرض
      </button>
    </div>
  );
}
