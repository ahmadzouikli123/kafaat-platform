import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import EditProfileForm from '@/components/EditProfileForm';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('expert_profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  // If no profile is linked to this account yet, check for an unclaimed
  // profile (registered before login existed) with a matching email.
  let unclaimedProfile = null;
  if (!profile) {
    const { data } = await supabase
      .from('expert_profiles')
      .select('*')
      .is('user_id', null)
      .eq('email', user.email)
      .maybeSingle();
    unclaimedProfile = data;
  }

  return (
    <div style={{ maxWidth: 760, margin: '48px auto', padding: '0 18px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>لوحتي</h1>
      <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 24 }}>{user.email}</p>

      {profile ? (
        <EditProfileForm profile={profile} />
      ) : unclaimedProfile ? (
        <div className="modal" style={{ margin: 0, maxWidth: 'none' }}>
          <div className="modal-body" style={{ textAlign: 'center', padding: 32 }}>
            <i className="fas fa-link" style={{ fontSize: 32, color: 'var(--green)', marginBottom: 14 }} />
            <p style={{ fontSize: 13.5, lineHeight: 1.8, marginBottom: 18 }}>
              وجدنا ملف كفاءة مسجّلاً بنفس بريدك ({user.email}) من قبل أن يتوفر نظام الدخول.
              <br />
              اربطه بحسابك الآن لتتمكن من تعديله.
            </p>
            <EditProfileForm profile={unclaimedProfile} claim />
          </div>
        </div>
      ) : (
        <div className="modal" style={{ margin: 0, maxWidth: 'none' }}>
          <div className="modal-body" style={{ textAlign: 'center', padding: 32 }}>
            <i className="fas fa-user-plus" style={{ fontSize: 32, color: 'var(--green)', marginBottom: 14 }} />
            <p style={{ fontSize: 13.5, marginBottom: 18 }}>لم تُنشئ ملف كفاءة بعد.</p>
            <a href="/register" className="btn btn-green">
              <i className="fas fa-user-plus" /> إنشاء ملف كفاءة
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
