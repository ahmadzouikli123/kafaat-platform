'use client';

import { useToast } from './Toast';

export default function KnowledgeCard({ article }) {
  const showToast = useToast();

  return (
    <div className="knowledge-card">
      <div className="knowledge-img">{article.icon}</div>
      <div className="knowledge-body">
        <h4>{article.title}</h4>
        <p>{article.description}</p>
        <div className="knowledge-meta">
          <span className="author">
            <i className="fas fa-user" style={{ marginLeft: 4 }} /> {article.author_name}
          </span>
          <span>
            <i className="fas fa-tag" style={{ marginLeft: 4 }} /> {article.field}
          </span>
        </div>
        <button
          className="btn btn-outline w-full"
          onClick={() => showToast('قريباً', 'عرض المحتوى الكامل قيد التطوير', 'info')}
        >
          <i className="fas fa-book-open" /> اقرأ المزيد
        </button>
      </div>
    </div>
  );
}
