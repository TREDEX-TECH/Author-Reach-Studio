'use client';
// Browser-side session helpers. Never import a service-role key here.
import { createClient } from '@/lib/supabase/client';
import { initials } from '@/lib/format';

export type Viewer = { name:string; initials:string; role:string; email:string; signedIn:boolean };
export const GUEST: Viewer = { name:'Your account', initials:'AR', role:'Not signed in', email:'', signedIn:false };

export async function getViewer(): Promise<Viewer> {
  try {
    const sb = createClient();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return GUEST;
    const meta = (user.user_metadata ?? {}) as Record<string, string>;
    const name = meta.full_name || meta.display_name || user.email?.split('@')[0] || 'Your account';
    return { name, initials: initials(name), role: meta.role || 'Member', email: user.email ?? '', signedIn: true };
  } catch { return GUEST; }
}

export async function signOut() {
  try { await createClient().auth.signOut(); } catch { /* ignore */ }
}
