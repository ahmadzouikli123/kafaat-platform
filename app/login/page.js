'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/Toast';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const showToast = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get('error')) {
      showToast('انتهت صلاحية الرابط', 'الرابط غير صالح أو منتهي — أدخل الرمز المرسل إلى بريدك بدلاً منه', 'error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSendCode(e) {
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
      showToast('خطأ', error.message || 'تعذر إرسال رمز الدخول، حاول مجدداً', 'error');
      console.error('signInWithOtp error:', error);
      return;
    }
    setSent(true);
  }

  async function handleVerifyCode(e) {
    e.preventDefault();
    if (!code || code.length < 6 || code.length > 10) {
      showToast('خطأ', 'أدخل رمز التحقق كاملاً كما ورد في الرسالة', 'error');
      return;
    }
    setVerifying(true);
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    });
    setVerifying(false);

    if (error) {
      showToast('خطأ', error.message || 'الرمز غير صحيح أو منتهي الصلاحية', 'error');
      console.error('verifyOtp error:', error);
      return;
    }
    showToast('تم', 'تم تسجيل الدخول بنجاح', 'success');
    router.push('/dashboard');
    router.refresh();
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
            <>
              <div style={{ textAlign: 'center', padding: '10px 0 20px' }}>
                <i className="fas fa-envelope-open-text" style={{ fontSize: 36, color: 'var(--green)', marginBottom: 12 }} />
                <p style={{ fontSize: 13, lineHeight: 1.8 }}>
                  أرسلنا رسالة إلى <strong>{email}</strong>.
                  <br />
                  أدخل رمز التحقق الموجود في الرسالة (أسرع وأضمن من الضغط على الرابط):
                </p>
              </div>
              <form onSubmit={handleVerifyCode}>
                <div className="form-group">
                  <label>رمز التحقق</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="رمز التحقق"
                    style={{ textAlign: 'center', fontSize: 22, letterSpacing: 8 }}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-green w-full" disabled={verifying}>
                  <i className="fas fa-check" /> {verifying ? 'جارٍ التحقق...' : 'تحقق ودخول'}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost w-full"
                  style={{ marginTop: 8 }}
                  onClick={() => {
                    setSent(false);
                    setCode('');
                  }}
                >
                  إرسال رمز جديد
                </button>
              </form>
            </>
          ) : (
            <form onSubmit={handleSendCode}>
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
                سنرسل لك رسالة تحتوي رمز دخول — بدون الحاجة لتذكّر كلمة مرور.
              </p>
              <button type="submit" className="btn btn-green w-full" disabled={submitting}>
                <i className="fas fa-paper-plane" /> {submitting ? 'جارٍ الإرسال...' : 'إرسال رمز الدخول'}
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
