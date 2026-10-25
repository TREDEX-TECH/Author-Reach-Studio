'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [mode, setMode] = useState<'signin'|'reset'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function signIn(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError('');
    try {
      const { error: err } = await createClient().auth.signInWithPassword({ email, password });
      if (err) { setError(err.message); setBusy(false); return; }
      const next = params.get('next');
      router.push(next && next.startsWith('/') ? next : '/portal');
      router.refresh();
    } catch { setError('Could not sign in. Please try again.'); setBusy(false); }
  }

  async function reset(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError(''); setNotice('');
    try {
      const { error: err } = await createClient().auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/portal`,
      });
      if (err) { setError(err.message); setBusy(false); return; }
      setNotice('If that address has an account, a password reset link is on its way.');
      setBusy(false);
    } catch { setError('Could not send the reset link. Please try again.'); setBusy(false); }
  }

  return (
    <>
      {error && <div className="form-msg form-msg-err" role="alert">{error}</div>}
      {notice && <div className="form-msg form-msg-ok" role="status">{notice}</div>}
      <form className="stack" style={{marginTop:22}} onSubmit={mode === 'signin' ? signIn : reset}>
        <div><label htmlFor="email">Work email</label>
          <input id="email" type="email" required autoComplete="email" value={email}
            onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></div>
        {mode === 'signin' && <div><label htmlFor="password">Password</label>
          <input id="password" type="password" required autoComplete="current-password" value={password}
            onChange={e => setPassword(e.target.value)} placeholder="••••••••" /></div>}
        <button className="btn btn-primary" type="submit" disabled={busy} style={{width:'100%'}}>
          {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in →' : 'Send reset link →'}
        </button>
      </form>
      <div className="row" style={{marginTop:16,justifyContent:'space-between'}}>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => {
          setMode(mode === 'signin' ? 'reset' : 'signin'); setError(''); setNotice('');
        }}>{mode === 'signin' ? 'Forgot password?' : '← Back to sign in'}</button>
      </div>
    </>
  );
}
