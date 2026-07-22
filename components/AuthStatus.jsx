'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AuthStatus() {
  const [user, setUser] = useState(undefined); // undefined = loading, null = logged out

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  if (user === undefined) return null; // avoid flash while loading

  if (!user) {
    return (
      <a
        href="/login"
        className="btn btn-outline btn-sm"
        style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}
      >
        <i className="fas fa-sign-in-alt" /> تسجيل الدخول
      </a>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <a
        href="/dashboard"
        className="btn btn-outline btn-sm"
        style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}
      >
        <i className="fas fa-user-circle" /> لوحتي
      </a>
      <button
        onClick={handleLogout}
        className="btn btn-outline btn-sm"
        style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}
      >
        <i className="fas fa-sign-out-alt" />
      </button>
    </div>
  );
}
