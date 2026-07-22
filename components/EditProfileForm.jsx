'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from './Toast';

export default function EditProfileForm({ profile, claim = false }) {
  const [form, setForm] = useState({
    title: profile.title || '',
    city: profile.city || '',
    country: profile.country || '',
    years_experience: profile.years_experience || '',
    skills: (profile.skills || []).join(', '),
    languages: (profile.languages || []).join('، '),
    bio: profile.bio || '',
    linkedin_url: profile.linkedin_url || '',
    available: profile.available,
  });
  const [submitting, setSubmitting] = useState(false);
  const showToast = useToast();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSave() {
    setSubmitting(true);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const payload = {
      title: form.title,
      city: form.city,
      country: form.country,
      years_experience: Number(form.years_experience) || 0,
      skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      languages: form.languages.split(/[،,]/).map((s) => s.trim()).filter(Boolean),
      bio: form.bio,
      linkedin_url: form.linkedin_url || null,
      available: !!form.available,
    };

    // When claiming an old anonymous profile, also attach the user_id.
    if (claim && user) {
      payload.user_id = user.id;
    }

    const { error } = await supabase.from('expert_profiles').update(payload).eq('id', profile.id);
    setSubmitting(false);

    if (error) {
      showToast('خطأ', 'تعذر حفظ التعديلات، حاول مجدداً', 'error');
      return;
    }
    showToast('تم', claim ? 'تم ربط الملف بحسابك وحفظ التعديلات' : 'تم حفظ التعديلات بنجاح', 'success');
    if (claim) window.location.reload();
  }

  return (
    <div className="modal" style={{ margin: 0, maxWidth: 'none' }}>
      <div className="modal-body">
        <div className="form-row">
          <div className="form-group">
            <label>المسمى الوظيفي</label>
            <input value={form.title} onChange={set('title')} />
          </div>
          <div className="form-group">
            <label>سنوات الخبرة</label>
            <input type="number" value={form.years_experience} onChange={set('years_experience')} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>الدولة</label>
            <input value={form.country} onChange={set('country')} />
          </div>
          <div className="form-group">
            <label>المدينة</label>
            <input value={form.city} onChange={set('city')} />
          </div>
        </div>
        <div className="form-group">
          <label>المهارات (افصل بفاصلة)</label>
          <input value={form.skills} onChange={set('skills')} />
        </div>
        <div className="form-group">
          <label>اللغات</label>
          <input value={form.languages} onChange={set('languages')} />
        </div>
        <div className="form-group">
          <label>نبذة عنك</label>
          <textarea value={form.bio} onChange={set('bio')} style={{ minHeight: 90 }} />
        </div>
        <div className="form-group">
          <label>رابط LinkedIn</label>
          <input value={form.linkedin_url} onChange={set('linkedin_url')} />
        </div>
        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            id="available"
            checked={!!form.available}
            onChange={(e) => setForm((f) => ({ ...f, available: e.target.checked }))}
            style={{ width: 'auto' }}
          />
          <label htmlFor="available" style={{ marginBottom: 0 }}>متاح حالياً للفرص والمشاريع</label>
        </div>
        <button className="btn btn-green w-full" onClick={handleSave} disabled={submitting}>
          <i className="fas fa-save" /> {submitting ? 'جارٍ الحفظ...' : claim ? 'ربط الملف وحفظ' : 'حفظ التعديلات'}
        </button>
      </div>
    </div>
  );
}
