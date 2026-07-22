'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/Toast';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const showToast = useToast();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('error')) {
      showToast('انتهت صلاحية الرابط', 'رابط الدخول غير صالح أو منتهي، أرسل رابطاً جديداً', 'error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) {
      showToast('خطأ', 'الرجاء إدخال بريدك الإلكتروني', 'error');
      return;
    }
    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });
    setSubmitting(false);

    if (error) {
      showToast('خطأ', 'تعذر إرسال رابط الدخول، حاول مجدداً', 'error');
      return;
    }
    setSent(true);
  }

  return (
    <div style={{ maxWidth: 460, margin: '80px auto', padding: '0 18px' }}>
      <div className="modal" style={{ margin: '0 auto' }}>
        <div className="modal-header">
          <h3>
            <i className="fas fa-sign-in-alt text-green" style={{ marginLeft: 8 }} />
            تسجيل الدخول
          </h3>
        </div>
        <div className="modal-body">
          {sent ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <i className="fas fa-envelope-open-text" style={{ fontSize: 40, color: 'var(--green)', marginBottom: 16 }} />
              <p style={{ fontSize: 13.5, lineHeight: 1.8 }}>
                أرسلنا رابط دخول إلى <strong>{email}</strong>.
                <br />
                افتح بريدك واضغط على الرابط لتسجيل الدخول — لا حاجة لكلمة مرور.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>البريد الإلكتروني</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <p style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: -6, marginBottom: 16 }}>
                سنرسل لك رابط دخول آمن — بدون الحاجة لتذكّر كلمة مرور.
              </p>
              <button type="submit" className="btn btn-green w-full" disabled={submitting}>
                <i className="fas fa-paper-plane" /> {submitting ? 'جارٍ الإرسال...' : 'إرسال رابط الدخول'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}