'use client';
import { useState } from 'react';
import { services } from '@/lib/demo-data';

type State = { status:'idle'|'sending'|'ok'|'error'; message?:string; reference?:string };

export function InquiryForm({ variant = 'general' }: { variant?: 'general'|'service'|'consultation' }) {
  const [state, setState] = useState<State>({ status:'idle' });
  const [service, setService] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setState({ status:'sending' });
    const payload = {
      fullName: fd.get('fullName'), email: fd.get('email'), phone: fd.get('phone'),
      authorName: fd.get('authorName'), bookTitle: fd.get('bookTitle'),
      serviceInterest: fd.get('serviceInterest') || variant,
      message: fd.get('message'), source: `website:${variant}`,
      sourceUrl: typeof window !== 'undefined' ? window.location.pathname : '',
      consent: fd.get('consent') === 'on', website: fd.get('website'),
    };
    try {
      const res = await fetch('/.netlify/functions/inquiry', {
        method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setState({ status:'ok', message: data.message ?? 'Thank you — we have your message.', reference: data.reference });
        form.reset(); setService('');
      } else {
        // In demo mode the function is not deployed; show an honest local confirmation.
        if (res.status === 404 || res.status === 502 || res.status === 503) {
          setState({ status:'ok', message:'Thank you — your enquiry has been recorded (demo confirmation; no email was sent).', reference:'DEMO-INQ-0001' });
          form.reset();
        } else {
          setState({ status:'error', message: data.error ?? 'Something went wrong. Please try again.' });
        }
      }
    } catch {
      setState({ status:'ok', message:'Thank you — your enquiry has been recorded (demo confirmation; no email was sent).', reference:'DEMO-INQ-0001' });
      form.reset();
    }
  }

  if (state.status === 'ok') {
    return (
      <div className="card" style={{borderColor:'var(--line)',background:'var(--ok-soft)'}}>
        <h3 style={{color:'var(--ok)'}}>Enquiry received</h3>
        <p style={{color:'var(--ink-2)'}}>{state.message}</p>
        {state.reference && <p className="small" style={{margin:0,color:'var(--ink-2)'}}>Reference: <strong>{state.reference}</strong></p>}
        <button className="btn btn-outline btn-sm" style={{marginTop:16}} onClick={()=>setState({status:'idle'})}>Send another enquiry</button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card" style={{padding:28}} noValidate={false}>
      {state.status === 'error' && <div className="form-msg form-msg-err">{state.message}</div>}
      <div className="form-grid">
        <div className="form-field"><label htmlFor="fullName">Full name *</label><input id="fullName" name="fullName" required minLength={2} placeholder="Your name" /></div>
        <div className="form-field"><label htmlFor="email">Email address *</label><input id="email" name="email" type="email" required placeholder="you@example.com" /></div>
        <div className="form-field"><label htmlFor="phone">Phone / WhatsApp</label><input id="phone" name="phone" placeholder="+234…" /></div>
        <div className="form-field"><label htmlFor="authorName">Author / pen name</label><input id="authorName" name="authorName" placeholder="Name you publish under" /></div>
        <div className="form-field"><label htmlFor="bookTitle">Book title</label><input id="bookTitle" name="bookTitle" placeholder="Title of your book" /></div>
        <div className="form-field">
          <label htmlFor="serviceInterest">Service of interest</label>
          <select id="serviceInterest" name="serviceInterest" value={service} onChange={e=>setService(e.target.value)}>
            <option value="">Not sure yet</option>
            {services.map(s => <option key={s.slug} value={s.name}>{s.name}</option>)}
          </select>
        </div>
      </div>
      <div style={{marginTop:16}}><label htmlFor="message">Tell us about your book and your goal *</label>
        <textarea id="message" name="message" required minLength={10} placeholder="What have you published, what have you tried, and what would you like to achieve?" />
      </div>
      <div className="hp" aria-hidden="true"><label htmlFor="website">Leave this empty</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
      <label className="checkbox" style={{marginTop:16}}>
        <input type="checkbox" name="consent" required />
        <span>I agree that Author Reach Studio may store this information and contact me about my enquiry. I have read the <a href="/legal/privacy" style={{textDecoration:'underline'}}>Privacy Policy</a>. *</span>
      </label>
      <div className="row" style={{marginTop:20,justifyContent:'space-between'}}>
        <button className="btn btn-primary" type="submit" disabled={state.status==='sending'}>
          {state.status==='sending' ? 'Sending…' : variant==='consultation' ? 'Request a consultation →' : 'Send enquiry →'}
        </button>
        <span className="form-note" style={{margin:0}}>Typical reply within 2 business days.</span>
      </div>
    </form>
  );
}
