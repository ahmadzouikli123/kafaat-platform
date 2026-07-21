'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from './Toast';

const initial = {
  fullName: '',
  email: '',
  title: '',
  field: '',
  country: '',
  city: '',
  exp: '',
  languages: '',
  skills: '',
  bio: '',
  linkedin: '',
};

const FIELDS = [
  'تكنولوجيا المعلومات', 'الهندسة', 'الصحة والطب', 'التعليم', 'المحاسبة والمالية',
  'البناء والعمران', 'الزراعة', 'اللوجستيات والنقل', 'التسويق والمبيعات',
  'الإدارة', 'القانون', 'الإعلام', 'أخرى',
];

const COUNTRIES = [
  'ألمانيا', 'تركيا', 'الولايات المتحدة', 'المملكة المتحدة', 'كندا', 'فرنسا', 'السويد',
  'هولندا', 'الإمارات', 'قطر', 'مصر', 'الأردن', 'اليابان', 'أستراليا', 'سويسرا',
  'النمسا', 'بلجيكا', 'إيطاليا', 'إسبانيا', 'البرازيل', 'أخرى',
];

export default function RegisterModal({ open, onClose, onRegistered }) {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const showToast = useToast();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit() {
    const required = ['fullName', 'email', 'title', 'field', 'country', 'city', 'exp', 'languages', 'skills', 'bio'];
    if (required.some((k) => !form[k])) {
      showToast('خطأ', 'الرجاء ملء جميع الحقول المطلوبة', 'error');
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.from('expert_profiles').insert({
      name: form.fullName,
      title: form.title,
      country: form.country,
      city: form.city,
      field: form.field,
      years_experience: Number(form.exp) || 0,
      skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      languages: form.languages.split(/[،,]/).map((s) => s.trim()).filter(Boolean),
      bio: form.bio,
      linkedin_url: form.linkedin || null,
      avatar_emoji: '🧑‍💼',
      available: true,
      is_verified: false,
    });
    setSubmitting(false);

    if (error) {
      showToast('خطأ', 'تعذر إتمام التسجيل، حاول مجدداً', 'error');
      return;
    }
    setForm(initial);
    onClose();
    showToast('تم', 'تم تسجيل ملفك بنجاح! سيظهر بعد المراجعة', 'success');
    onRegistered?.();
  }

  return (
    <div className={`modal-overlay${open ? ' active' : ''}`}>
      <div className="modal modal-lg">
        <div className="modal-header">
          <h3>
            <i className="fas fa-user-plus text-green" style={{ marginLeft: 8 }} />
            انضم ككفاءة سورية في الخارج
          </h3>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-row">
              <div className="form-group">
                <label>الاسم الكامل *</label>
                <input value={form.fullName} onChange={set('fullName')} placeholder="مثال: د. أحمد الخالدي" required />
              </div>
              <div className="form-group">
                <label>البريد الإلكتروني *</label>
                <input type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>المسمى الوظيفي *</label>
                <input value={form.title} onChange={set('title')} placeholder="مثال: مهندس برمجيات أول" required />
              </div>
              <div className="form-group">
                <label>المجال *</label>
                <select value={form.field} onChange={set('field')} required>
                  <option value="">اختر المجال</option>
                  {FIELDS.map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>الدولة الحالية *</label>
                <select value={form.country} onChange={set('country')} required>
                  <option value="">اختر الدولة</option>
                  {COUNTRIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>المدينة *</label>
                <input value={form.city} onChange={set('city')} placeholder="مثال: برلين" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>سنوات الخبرة *</label>
                <input type="number" min="1" max="50" value={form.exp} onChange={set('exp')} placeholder="مثال: 10" required />
              </div>
              <div className="form-group">
                <label>اللغات المتقنة *</label>
                <input value={form.languages} onChange={set('languages')} placeholder="مثال: العربية، الإنجليزية، الألمانية" required />
              </div>
            </div>
            <div className="form-group">
              <label>المهارات (افصل بينها بفاصلة) *</label>
              <input value={form.skills} onChange={set('skills')} placeholder="مثال: React, Node.js, Cloud Architecture, AI" required />
            </div>
            <div className="form-group">
              <label>نبذة عنك *</label>
              <textarea
                value={form.bio}
                onChange={set('bio')}
                placeholder="اكتب نبذة مختصرة عن خبراتك وإنجازاتك المهنية..."
                required
                style={{ minHeight: 80 }}
              />
            </div>
            <div className="form-group">
              <label>رابط LinkedIn (اختياري)</label>
              <input type="url" value={form.linkedin} onChange={set('linkedin')} placeholder="https://linkedin.com/in/username" />
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            إلغاء
          </button>
          <button className="btn btn-green" onClick={handleSubmit} disabled={submitting}>
            <i className="fas fa-check" /> {submitting ? 'جارٍ التسجيل...' : 'تسجيل الكفاءة'}
          </button>
        </div>
      </div>
    </div>
  );
}
