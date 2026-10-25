'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function ProceedToPayment({ invoiceId, invoiceNumber, enabled = false }: {
  invoiceId:string; invoiceNumber:string; enabled?:boolean;
}) {
  const [state, setState] = useState<'idle'|'loading'|'error'>('idle');
  const [message, setMessage] = useState('');

  async function pay() {
    setState('loading'); setMessage('');
    try {
      const { data: { session } } = await createClient().auth.getSession();
      if (!session) {
        setState('error');
        setMessage('Please sign in to pay this invoice. We will never ask you to pay from a link in a chat message.');
        return;
      }
      const res = await fetch('/api/payments/initialize', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${session.access_token}` },
        body: JSON.stringify({ invoiceId }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.authorizationUrl) { window.location.href = data.authorizationUrl; return; }
      setState('error');
      setMessage(data.error ?? 'Online payment is not available for this invoice right now. No charge was made.');
    } catch {
      setState('error');
      setMessage('We could not reach the payment service. No charge was made. Please try again or contact us.');
    }
  }

  if (!enabled) {
    return (
      <div>
        <button className="btn btn-brass" disabled>Payments not enabled</button>
        <p className="small faint" style={{marginTop:12,maxWidth:'48ch'}}>
          Online payment for invoice {invoiceNumber} is not available yet. Contact us and we will
          arrange payment once the payment provider is connected. No charge can be made from this page.
        </p>
      </div>
    );
  }

  return (
    <div>
      <button className="btn btn-brass" onClick={pay} disabled={state==='loading'}>
        {state==='loading' ? 'Opening secure checkout…' : 'Proceed to Payment →'}
      </button>
      {state==='error' && <div className="notice" style={{marginTop:14,fontSize:'.82rem'}}><strong>No payment was taken.</strong>&nbsp; {message}</div>}
      <p className="small faint" style={{marginTop:12,maxWidth:'48ch'}}>
        Invoice {invoiceNumber}. You will be redirected to Paystack. We verify the transaction on our
        server before this invoice changes status — the browser success screen is never proof of payment.
      </p>
    </div>
  );
}
