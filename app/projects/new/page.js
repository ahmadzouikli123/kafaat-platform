'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/Toast';

const FIELDS = [
  'تكنولوجيا المعلومات', 'الهندسة', 'الصحة والطب', 'التعليم', 'المحاسبة والمالية',
  'البناء والعمران', 'الزراعة', 'اللوجستيات والنقل', 'التسويق والمبيعات', 'أخرى',
];

const initial = {
  title: '', description: '', field: '', budgetMin: '', budgetMax: '', duration: '', workType: 'عن بُعد',
};

export default function NewProjectPage() {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const showToast = useToast();
  const router = useRouter();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.description || !form.field || !form.duration) {
      showToast('خطأ', 'الرجاء ملء جميع الحقول المطلوبة', 'error');
      return;
    }
    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.from('projects').insert({
      title: form.title,
      description: form.description,
      field: form.field,
      budget_min: form.budgetMin ? Number(form.budgetMin) : null,
      budget_max: form.budgetMax ? Number(form.budgetMax) : null,
      duration: form.duration,
      work_type: form.workType,
      status: 'open',
    });
    setSubmitting(false);

    if (error) {
      showToast('خطأ', 'تعذر نشر المشروع، حاول مجدداً', 'error');
      return;
    }
    showToast('تم', 'تم نشر مشروعك بنجاح!', 'success');
    router.push('/');
  }

  return (
    <div style={{ maxWidth: 700, margin: '60px auto', padding: '0 18px' }}>
      <div className="modal modal-lg" style={{ margin: '0 auto' }}>
        <div className="modal-header">
          <h3>
            <i className="fas fa-project-diagram text-green" style={{ marginLeft: 8 }} />
            اقترح مشروعاً أو استشارة
          </h3>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>عنوان المشروع *</label>
              <input value={form.title} onChange={set('title')} placeholder="مثال: تصميم نظام إدارة مستشفيات" required />
            </div>
            <div className="form-group">
              <label>وصف المشروع *</label>
              <textarea value={form.description} onChange={set('description')} placeholder="اشرح المشروع والمطلوب بالتفصيل..." required style={{ minHeight: 100 }} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>المجال *</label>
                <select value={form.field} onChange={set('field')} required>
                  <option value="">اختر المجال</option>
                  {FIELDS.map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>المدة *</label>
                <input value={form.duration} onChange={set('duration')} placeholder="مثال: 6 أشهر" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>الميزانية الدنيا (دولار)</label>
                <input type="number" value={form.budgetMin} onChange={set('budgetMin')} placeholder="مثال: 3000" />
              </div>
              <div className="form-group">
                <label>الميزانية القصوى (دولار)</label>
                <input type="number" value={form.budgetMax} onChange={set('budgetMax')} placeholder="مثال: 6000" />
              </div>
            </div>
            <div className="form-group">
              <label>نمط العمل</label>
              <select value={form.workType} onChange={set('workType')}>
                <option>عن بُعد</option>
                <option>ميداني</option>
                <option>زيارات دورية</option>
              </select>
            </div>
            <div className="modal-footer" style={{ padding: '18px 0 0' }}>
              <button type="button" className="btn btn-ghost" onClick={() => router.push('/')}>
                إلغاء
              </button>
              <button type="submit" className="btn btn-green" disabled={submitting}>
                <i className="fas fa-paper-plane" /> {submitting ? 'جارٍ النشر...' : 'نشر المشروع'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
