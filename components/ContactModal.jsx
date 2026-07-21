'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from './Toast';

const initial = { name: '', email: '', subject: '', message: '' };

export default function ContactModal({ open, onClose }) {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const showToast = useToast();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit() {
    if (!form.name || !form.email || !form.subject || !form.message) {
      showToast('خطأ', 'الرجاء ملء جميع الحقول', 'error');
      return;
    }
    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.from('contact_messages').insert({
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
    });
    setSubmitting(false);

    if (error) {
      showToast('خطأ', 'تعذر إرسال الرسالة، حاول مجدداً', 'error');
      return;
    }
    setForm(initial);
    onClose();
    showToast('تم', 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً', 'success');
  }

  return (
    <div className={`modal-overlay${open ? ' active' : ''}`}>
      <div className="modal">
        <div className="modal-header">
          <h3>
            <i className="fas fa-envelope text-green" style={{ marginLeft: 8 }} />
            تواصل معنا
          </h3>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>الاسم الكامل *</label>
              <input type="text" value={form.name} onChange={set('name')} placeholder="اسمك الكامل" required />
            </div>
            <div className="form-group">
              <label>البريد الإلكتروني *</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" required />
            </div>
            <div className="form-group">
              <label>الموضوع *</label>
              <select value={form.subject} onChange={set('subject')} required>
                <option value="">اختر الموضوع</option>
                <option>استفسار عام</option>
                <option>دعم فني</option>
                <option>شراكة</option>
                <option>شكوى</option>
                <option>اقتراح</option>
              </select>
            </div>
            <div className="form-group">
              <label>الرسالة *</label>
              <textarea
                value={form.message}
                onChange={set('message')}
                placeholder="اكتب رسالتك هنا..."
                required
              />
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            إلغاء
          </button>
          <button className="btn btn-green" onClick={handleSubmit} disabled={submitting}>
            <i className="fas fa-paper-plane" /> {submitting ? 'جارٍ الإرسال...' : 'إرسال'}
          </button>
        </div>
      </div>
    </div>
  );
}
